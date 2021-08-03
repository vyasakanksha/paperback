const functions = require("firebase-functions");
const admin = require("firebase-admin");

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "1GB",
};

/**
 * When a new book is added to the cloud datastore from a source where the book cover photo
 * is externally hosted, it is taken from there and uploaded to gcp
 * The filename of the book cover is uodated in cloud datastore
 */
exports.uploadBookCovers = functions.runWith(runtimeOpts).region("asia-east2").firestore
  .document("{collection}/{isbn}")
  .onWrite(async (change, context) => {

    // Downloads an image from an external url uploads it to cloud storage and return the filename
    async function uploadsgcp(urllist, isbn, collection) {
      const path = require("path");
      const os = require("os");

      fname = isbn.replace(/ /g, "");

      const tempLocalFile = path.join(os.tmpdir(), fname);
      console.log("url", urllist);
      console.log("filePath", tempLocalFile);

      filename = await downloadImage(urllist, tempLocalFile, fname, collection, upload);
      return filename;
    }

    // Download helper function
    async function downloadImage(urllist, dest, name, collection, callback) {
      "use strict";
      const fs = require("fs");
      const axios = require("axios");

      // TO DO: Make the axios call once

      // Read the file to get the filename. Assume .jpg as default if content type empty
      
      async function fetchImage(url) {
        var content_header = undefined

        console.log("START FETCH URL:", url, url)
          const response = await axios({
            url: url,
            method: "GET",
          })
          if(response.headers["content-type"] !== undefined) {
            console.log("SUCCESS:", url)
            content_header = response.headers["content-type"]
            console.log("RETUREN:", url, content_header)
            return content_header
          }
        }

      let url = urllist[0]
      let content_header = await fetchImage(url);
      if(content_header === undefined) {
        url = urllist[1]
        content_header = await fetchImage(url);
      }
      console.log("Finalurl", url, content_header)
      var filename = name + "." + content_header.split("/")[1];

      const writer = fs.createWriteStream(dest).on("close", function() {
        callback(dest, filename, collection);
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
    var upload = async function(tempLocalFile, filename, collection) {
      console.log("Beginning Upload");
      const bucket = admin
        .storage()
        .bucket("gs://paperback-books-7652f.appspot.com");
      await bucket.upload(tempLocalFile, {
        destination: path.join(collection, filename),
      });
      console.log("File uploaded to Storage at", filename);
    };

    // Main Code
    const path = require("path");
    console.log("Collection", context.resource.name)
    path_parts = context.resource.name.split('/documents/')[1].split('/')
    collection_path = path_parts[0]

    isbn = context.params.isbn;
    data = change.after.data();
    console.log("source", data["source"]);
    data["image"] = [];

    // External hosting of cover images is based on source
    if (data["source"] === "bookbuddy") {
      if (data["imageraw"] === "") {

        // When the image is missing we get it from an external API 
        // TO DO: Pull this logic out and make it modular
        data["image"].push("http://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg")
        data["image"].push("http://books.google.com/books/content?id=" +
        data["googleID"] +
        "&printsec=frontcover&img=1&zoom=1&source=gbs_api")
      }
      else {
        data["image"].push(data["imageraw"])
      }
      console.log("IMAGE!", data["image"])
      fname = await uploadsgcp(data["image"], isbn, collection_path);
    } else {
      console.log("The image is not an a url");
      fname = path.dirname(data[d]["imageraw"])
    }
    console.log("image", fname);
  });
