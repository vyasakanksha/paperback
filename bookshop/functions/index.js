// [START import]
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const path = require('path');
const csvtojson = require("csvtojson")
const fs = require('fs');
const db = admin.firestore();
var book = require('./Book')
const mkdirp = require('mkdirp');
const spawn = require('child-process-promise').spawn;
const os = require('os');


db.settings({ ignoreUndefinedProperties: true })

// const {Translate} = require('@google-cloud/translate').v2;

const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '128MB'
  }

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
    }
}

const extractFields = [
    'ISBN', 
    'Title',
    'Author',
    'Publisher',
    'Date Added',
    'Image URL',
    'Category',
    'List Price',
    'Source'
];

function addtocollection(collection, item, key) {
    var docRef = db.collection(collection).doc(key);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            if (collection === 'inStock') {
                db.collection(collection).doc(key).update({
                    count: doc.data().count + 1
                })
            }
        } else {
            // doc.data() will be undefined in this case
            db.collection(collection).doc(key).set(item).then(function() {
                console.log("Document successfully written!");
            });
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

exports.uploadBooks = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
    parsedData = []
    data = []
    temp = {}

    const dir = './rawFiles'
    const files = fs.readdirSync(dir)

    async function readfiles(files, dir) {
        data = []
        for (file of files) {
            console.log(file)
            var tempData = await csvtojson().fromFile(path.join(dir, file));
            data.push(...tempData)
        }
    }
    await readfiles(files, dir)
    for (let d in data) {
        if (data[d]['Source'] == 'bookbuddy') {
            console.log((data[d]['Image URL']))
        }
        parsedData.push(parseData(data[d], extractFields))
    }

    function parseData(data, extractFields) {
        extractFields.map(nm => {
            temp[nm] = data[nm];
        })
        fields = Object.values(temp)
        b = new book.Book(fields[0], fields[1], fields[2], fields[3], fields[4], fields[5], fields[6], fields[7], fields[8])
    }
});

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 160;
const THUMB_MAX_WIDTH = 107;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
    // File and directory paths.
    const filePath = object.name;
    const contentType = object.contentType; // This is the image MIME type
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
    }

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMB_PREFIX)) {
    return console.log('Already a Thumbnail.');
    }

    // Cloud Storage files.
    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const thumbFile = bucket.file(thumbFilePath);
    const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
    };

    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempLocalDir)
    // Download file from bucket.
    await file.download({destination: tempLocalFile});
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
    console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
    console.log('Thumbnail uploaded to Storage at', thumbFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalThumbFile);
    // Get the Signed URLs for the thumbnail and original image.
    const config = {
        action: 'read',
        expires: '03-01-2500',
    };
    const results = await Promise.all([
    thumbFile.getSignedUrl(config),
    file.getSignedUrl(config),
    ]);
    console.log('Got Signed URLs.');
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];
    // Add the URLs to the Database
    // await admin.database().ref('images').push({path: fileUrl, thumbnail: thumbFileUrl});
    return console.log('Thumbnail URLs saved to database.', thumbFileUrl);
});