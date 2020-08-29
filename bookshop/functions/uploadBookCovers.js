const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * When a new book is added to the cloud datastore from a source where the book cover photo
 * is externally hosted, it is taken from there and uploaded to gcp
 * The filename of the book cover is uodated in cloud datastore
 */
exports.uploadBookCovers = functions.firestore
  .document("{collection}/{isbn}")
  .onWrite(async (change, context) => {

    // Downloads an image from an external url uploads it to cloud storage and return the filename
    async function uploadsgcp(url, isbn) {
      const path = require("path");
      const os = require("os");

      fname = isbn.replace(/ /g, "");

      const tempLocalFile = path.join(os.tmpdir(), fname);
      console.log("url", url);
      console.log("filePath", tempLocalFile);

      filename = await downloadImage(url, tempLocalFile, fname, upload);
      return filename;
    }

    // Download helper function
    async function downloadImage(url, dest, name, callback) {
      "use strict";
      const fs = require("fs");
      const axios = require("axios");

      // TO DO: Make the axios call once

      // Read the file to get the filename
      const res = await axios({
        url,
        method: "GET",
      });
      var filename = name + "." + res.headers["content-type"].split("/")[1];

      const writer = fs.createWriteStream(dest).on("close", function() {
        callback(dest, filename);
      });

      // Read the file to get the stream
      const resstream = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      resstream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      return filename;
    }

    // Upload helper function
    var upload = async function(tempLocalFile, filename) {
      console.log("Begining Upload");
      const bucket = admin
        .storage()
        .bucket("gs://paperback-books-7652f.appspot.com/");
      await bucket.upload(tempLocalFile, {
        destination: filename,
      });
      console.log("File uploaded to Storage at", filename);
    };

    // Main Code
    isbn = context.params.isbn;
    data = change.after.data();
    console.log("source", data["source"]);
    data["image"] = [];

    // External hosting of cover images is based on source
    if (data["source"] === "bookbuddy") {
      if (data["imageraw"] === "") {

        // When the image is missing we get it from an external API 
        // TO DO: Pull this logic out and make it modular
        data["imageraw"] =
          "http://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg" !== ""
            ? "http://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg"
            : "http://books.google.com/books/content?id=" +
              googleID +
              "&printsec=frontcover&img=1&zoom=1&source=gbs_api";
      }

      console.log("url", data["imageraw"]);
      fname = await uploadsgcp(data["imageraw"], isbn);
    } else {
      console.log("The image is not an a url");
      fname = path.dirname(data[d]["imageraw"])
    }

    // This structure will contain the thumbnail URL when it is generated
    image = {
      filename: fname,
    };
    data["image"].push(image);
    console.log("image", image);
  });
