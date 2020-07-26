// [START import]
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const path = require('path');
const os = require('os');
const neatCsv = require('neat-csv');
const csvtojson = require("csvtojson")
var books = require('google-books-search');
const {google} = require('googleapis');
const fs = require('fs');
var array = require('lodash/array');
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })

// const {Translate} = require('@google-cloud/translate').v2;

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '128MB'
  }

// [END import]

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
// exports.uploadBooks = functions.storage.object().onFinalize(async (object) => {
exports.uploadBooks = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
//   // [START eventAttributes]
//   const fileBucket = object.bucket; // The Storage bucket that contains the file.
//   const filePath = object.name; // File path in the bucket.
//   const contentType = object.contentType; // File content type.
//   const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
//   // [END eventAttributes]

//   // [START stopConditions]
//   // Exit if this is triggered on a file that is not an image.
//   if (!contentType.startsWith('image/') || !contentType.startsWith('text/csv')) {
//     return console.log('This is not an image or spreadsheet.');
//   }

const extractFields = [
    'ISBN', 
    'Date Added',
    'Uploaded Image URL',
    'Category',
    'List Price'
];

parsedData = []
data = []
const dir = './rawfilesBookBuddy'
const files = fs.readdirSync(dir)

for (file of files) {
    var tempData = await csvtojson().fromFile(path.join(dir, file));
    data.push(...tempData)
    for(let i of tempData) {
        var temp = {}
        extractFields.map(nm => {
            temp[nm] = i[nm];
        })
        parsedData.push(temp)
    }
}
parsedData = array.uniqBy(parsedData, 'Date Added')

for(let i of data) {
    addtocollection("rawData", i, i['Date Added'])
}

const booksapi = google.books({
    version: 'v1',
    auth: "AIzaSyBSbWl6-e2C7eNJZ_p-JmStcTTKaPrhY00", // specify your API key here
});

// const translate = new Translate();

// async function translateText(text, target) {
//     // Translates the text into the target language. "text" can be a string for
//     // translating a single piece of text, or an array of strings for translating
//     // multiple texts.
//     let [translations] = await translate.translate(text, target);
//     translations = Array.isArray(translations) ? translations : [translations];
//     console.log('Translations:');
//     translations.forEach((translation, i) => {
//       console.log(`${text[i]} => (${target}) ${translation}`);
//     });
//   }


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

remaining = []
collection = []
for(let i of parsedData.slice(0, 80)) {
    console.log(i['ISBN'])
    const gresp = await booksapi.volumes.list({q: i['ISBN'], printType: 'books', langRestrict: 'hi'});

    if (!gresp.data.items) {
        console.log("REMAINING")
        data.filter(function (_,n){
            if (data[n]['ISBN'] === i['ISBN']) {
                remaining.push(data[n])
            }
        });
    } else {
        let book = {
            isbn: i['ISBN'],
            title: gresp.data.items[0].volumeInfo.title, 
            author: gresp.data.items[0].volumeInfo.authors, 
            publisher: gresp.data.items[0].volumeInfo.publisher,
            genre: "",
            distributor: "",
            price: i['List Price'].replace(/\D/g,''),
            image_url: "",
            category: i['Category']
         };

         let stock = {
            book: book,
            count: 1,
         };
         addtocollection("books", book, i['ISBN'])
         addtocollection("inStock", stock, i['ISBN'])
        //  console.log(translateText(gresp.data.items[0].volumeInfo.title, 'hi'))
    }
}

//   // [START thumbnailGeneration]
//   // Download file from bucket.
//   const bucket = admin.storage().bucket(fileBucket);
//   const tempFilePath = path.join(os.tmpdir(), fileName);
//   const metadata = {
//     contentType: contentType,
//   };
//   await bucket.file(filePath).download({destination: tempFilePath});
//   console.log('Image downloaded locally to', tempFilePath);
//   // Generate a thumbnail using ImageMagick.
//   await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
//   console.log('Thumbnail created at', tempFilePath);
//   // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
//   const thumbFileName = `thumb_${fileName}`;
//   const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
//   // Uploading the thumbnail.
//   await bucket.upload(tempFilePath, {
//     destination: thumbFilePath,
//     metadata: metadata,
//   });
//   // Once the thumbnail has been uploaded delete the local file to free up disk space.
//   return fs.unlinkSync(tempFilePath);
//   // [END thumbnailGeneration]
});
// [END generateThumbnail]