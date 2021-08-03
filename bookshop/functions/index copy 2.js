// // [START import]
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp()
// const path = require('path');
// const os = require('os');
// const neatCsv = require('neat-csv');
// const csvtojson = require("csvtojson")
// var books = require('google-books-search');
// const {google} = require('googleapis');
// const fs = require('fs');
// var array = require('lodash/array');
// const db = admin.firestore();
// var booksisbn = require('./book-isbn');

// db.settings({ ignoreUndefinedProperties: true })

// // const {Translate} = require('@google-cloud/translate').v2;

// const runtimeOpts = {
//     timeoutSeconds: 300,
//     memory: '128MB'
//   }

// // exports.uploadBooks = functions.storage.object().onFinalize(async (object) => {
// exports.uploadBooks = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
// //   // [START eventAttributes]
// //   const fileBucket = object.bucket; // The Storage bucket that contains the file.
// //   const filePath = object.name; // File path in the bucket.
// //   const contentType = object.contentType; // File content type.
// //   const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
// //   // [END eventAttributes]

// //   // [START stopConditions]
// //   // Exit if this is triggered on a file that is not an image.
// //   if (!contentType.startsWith('image/') || !contentType.startsWith('text/csv')) {
// //     return console.log('This is not an image or spreadsheet.');
// //   }

// const extractFields = [
//     'ISBN', 
//     'Date Added',
//     'Uploaded Image URL',
//     'Category',
//     'List Price'
// ];

// parsedData = []
// const dir = './rawfilesBookBuddy'
// const files = fs.readdirSync(dir)

// function rawDataToFirebase(files) {
//     data = []
//     for (file of files) {
//         var tempData = await csvtojson().fromFile(path.join(dir, file));
//         data.push(...tempData)
//     }

//     for(let i of data) {
//         addtocollection("rawData", i, i['Date Added'])
//     }
// }


// function addtocollection(collection, item, key) {
//     var docRef = db.collection(collection).doc(key);

//     docRef.get().then(function(doc) {
//         if (doc.exists) {
//             if (collection === 'inStock') {
//                 db.collection(collection).doc(key).update({
//                     count: doc.data().count + 1
//                 })
//             }
//         } else {
//             // doc.data() will be undefined in this case
//             db.collection(collection).doc(key).set(item).then(function() {
//                 console.log("Document successfully written!");
//             });
//         }
//     }).catch(function(error) {
//         console.log("Error getting document:", error);
//     });
// }

// // }

// //   // [START thumbnailGeneration]
// //   // Download file from bucket.
// //   const bucket = admin.storage().bucket(fileBucket);
// //   const tempFilePath = path.join(os.tmpdir(), fileName);
// //   const metadata = {
// //     contentType: contentType,
// //   };
// //   await bucket.file(filePath).download({destination: tempFilePath});
// //   console.log('Image downloaded locally to', tempFilePath);
// //   // Generate a thumbnail using ImageMagick.
// //   await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
// //   console.log('Thumbnail created at', tempFilePath);
// //   // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
// //   const thumbFileName = `thumb_${fileName}`;
// //   const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
// //   // Uploading the thumbnail.
// //   await bucket.upload(tempFilePath, {
// //     destination: thumbFilePath,
// //     metadata: metadata,
// //   });
// //   // Once the thumbnail has been uploaded delete the local file to free up disk space.
// //   return fs.unlinkSync(tempFilePath);
// //   // [END thumbnailGeneration]
// });
// // [END generateThumbnail]

// // exports.uploadBooks = functions.storage.object().onFinalize(async (object) => {
//     exports.uploadBooksOLD = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
//         parsedData = []
    
//         const dir = './rawFiles'
//         const files = fs.readdirSync(dir)
    
//         async function rawDataToFirebase(files, dir, source) {
//             data = []
//             for (file of files) {
//                 var tempData = await csvtojson().fromFile(path.join(dir, file));
//                 data.push(...tempData)
//             }
//             console.log(data.length)
    
//             for(let i of data) {
//                 if (source == 'handylib') {
//                     d = new Date(i['Date added:'] + " " + new Date().toLocaleTimeString())
//                     await new Promise(resolve => setTimeout(resolve, 1010));
//                 } else if (source == 'bookbuddy') {
//                     d = new Date(i['Date Added'])
//                 }
//                 i['source'] = source
//                 i['year'] = d.getFullYear();
//                 i['month'] = d.getMonth() + 1;
//                 i['date'] = d.getDate();
//                 key = d.toISOString()
//                 console.log(key)
//                 addtocollection("rawData", i, key)
//             }
//             console.log("END")
//             return process.exit(22);
//         }
    
//     });
    

// //   // [START thumbnailGeneration]
// //   // Download file from bucket.
// //   const bucket = admin.storage().bucket(fileBucket);
// //   const tempFilePath = path.join(os.tmpdir(), fileName);
// //   const metadata = {
// //     contentType: contentType,
// //   };
// //   await bucket.file(filePath).download({destination: tempFilePath});
// //   console.log('Image downloaded locally to', tempFilePath);
// //   // Generate a thumbnail using ImageMagick.
// //   await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
// //   console.log('Thumbnail created at', tempFilePath);
// //   // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
// //   const thumbFileName = `thumb_${fileName}`;
// //   const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
// //   // Uploading the thumbnail.
// //   await bucket.upload(tempFilePath, {
// //     destination: thumbFilePath,
// //     metadata: metadata,
// //   });
// //   // Once the thumbnail has been uploaded delete the local file to free up disk space.
// //   return fs.unlinkSync(tempFilePath);
// //   // [END thumbnailGeneration]
// // [END generateThumbnail]