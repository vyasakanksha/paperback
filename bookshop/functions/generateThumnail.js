// [START import]
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true });

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    // Max height and width of the thumbnail in pixels.
    const THUMB_MAX_HEIGHT = 160;
    const THUMB_MAX_WIDTH = 107;
    // Thumbnail prefix added to file names.
    const THUMB_DIR = "thumbnail";
    const THUMB_PREFIX = "thumb_";

    const path = require("path");
    const fs = require("fs");
    const mkdirp = require("mkdirp");
    const spawn = require("child-process-promise").spawn;
    const os = require("os");

    // File and directory paths.
    const filePath = object.name;
    const contentType = object.contentType; // This is the image MIME type
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const thumbFilePath = path.normalize(
      path.join(fileDir, `${THUMB_PREFIX}${fileName}`)
    );
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMB_PREFIX)) {
      return console.log("Already a Thumbnail.");
    }

    // Cloud Storage files.
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const metadata = {
      contentType: contentType,
      // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
      // 'Cache-Control': 'public,max-age=3600',
    };

    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempLocalDir);
    // Download file from bucket.
    await file.download({ destination: tempLocalFile });
    console.log("The file has been downloaded to", tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    await spawn(
      "convert",
      [
        tempLocalFile,
        "-strip",
        "-auto-orient",
        "-thumbnail",
        `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
        tempLocalThumbFile,
      ],
      { capture: ["stdout", "stderr"] }
    );
    console.log("Thumbnail created at", tempLocalThumbFile);
    // Uploading the Thumbnail.
    const thumbRemoteFilePath = path.normalize(
      path.join(fileDir, THUMB_DIR, `${THUMB_PREFIX}${fileName}`)
    );
    const thumbFile = bucket.file(thumbRemoteFilePath);
    await bucket.upload(tempLocalThumbFile, {
      destination: thumbRemoteFilePath,
      metadata: metadata,
    });
    console.log("Thumbnail uploaded to Storage at", thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);
    // Get the Signed URLs for the thumbnail and original image.
    const config = {
      action: "read",
      expires: "03-01-2500",
    };
    const results = await Promise.all([
      thumbFile.getSignedUrl(config),
      file.getSignedUrl(config),
    ]);
    console.log("Got Signed URLs.");
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];
    const isbn = fileName.split('.')[0]
    const image = {
        filename: fileName,
        url: fileUrl, 
        thumb_url: thumbFileUrl
    };
    // Add the URLs to the Database
    // To update image
    db.collection("booksCollection")
    .doc(isbn)
    .update({
      image: admin.firestore.FieldValue.arrayUnion(image)
    })
    .then(function() {
      console.log("Document successfully updated!");
      return;
    })
    .catch(function() {
      console.log(
        "There was an error with the document update for isbn!",
        isbn
      );
      return;
    });
  });