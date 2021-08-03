// [START import]
const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./paperbackcollective-d7e6e4cbfcb5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://paperbackcollective-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

const thumb = require('./generateThumbnail')
exports.generateThumbnail = thumb.generateThumbnail;

const upload = require('./uploadBookCovers');
const { count } = require("console");
exports.uploadBookCovers = upload.uploadBookCovers;


db.settings({ ignoreUndefinedProperties: true });

// const {Translate} = require('@google-cloud/translate').v2;

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "1GB",
};


const extractFields = [
  "ISBN",
  "Title",
  "Author",
  "Publisher",
  "Date Added",
  "Image URL",
  "Category",
  "List Price",
  "Source",
  "Google VolumeID"
];

function addtocollection(collection, item, key) {
  console.log(key)
  var docRef = db.collection('hindiCollection').doc(key);
  console.log(docRef)

  docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
      db.collection(collection)
        .doc(key)
        .update({
          count: doc.data().count + 1,
        })
        .then(function() {
            console.log("Document successfully updated!", key);
            return
          });
      } else {
        // doc.data() will be undefined in this case
        db.collection(collection)
          .doc(key)
          .set(item)
          .then(function() {
            console.log("Document successfully written!", key);
            return
          });
      }
      return
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
}

exports.uploadBooks = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    const path = require("path");
    const csvtojson = require("csvtojson");
    const fs = require("fs");
    const spawn = require("child-process-promise").spawn;

    parsedData = [];
    data = [];
    temp = {};
    books = [];

    const dir = "./rawFiles";
    const files = fs.readdirSync(dir);

    async function readfiles(files, dir) {
      data = [];
      for (file of files) {
        console.log(file);
        var tempData = await csvtojson().fromFile(path.join(dir, file));
        data.push(...tempData);
      }
    }
    await readfiles(files, dir);

    for(var d in data) {
      parsedData.push(parseData(data[d], extractFields));
    }

    // for (let i = 20; i< 50; i++) {
    //   console.log("Adding to collection", i, books[i])
    //   addtocollection("hindiCollection", books[i], books[i].isbn)
    // }

    for (b in books) {
        console.log("Adding to collection", books[b])
        addtocollection("hindiCollection", books[b], books[b].isbn)
    }

    function parseData(data, extractFields) {
      extractFields.map((nm) => {
        temp[nm] = data[nm];
      });
      fields = Object.values(temp);

      b = {
        timestamp: Date.now(),
        isbn: fields[0],
        name: fields[1],
        author: fields[2],
        publisher: fields[3],
        dateAdded: fields[4],
        imageraw: fields[5],
        image: [],
        price: fields[7],
        source: fields[8],
        googleID: fields[9],
        count: 1
      };

      books.push(b);
    }
    return;
});

exports.uploadWIXBooks = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    const path = require("path");
    const csvtojson = require("csvtojson");
    const fs = require("fs");
    const spawn = require("child-process-promise").spawn;

    parsedData = [];
    data = [];
    temp = {};
    books = [];

    const file = "HindiCollection.csv";

    async function readfiles(file) {
      data = [];
      console.log(file);
      var tempData = await csvtojson().fromFile(file);
      data.push(...tempData);
    }
    await readfiles(file);

    // console.log(data)

    for(var d in data) {
      parsedData.push(parseData(data[d], extractFields));
    }

    // for(var b in books) {
    //   console.log(b)
    //   console.log("Adding to collection", b.isbn, b)
    //   addtocollection("hindiCollection", b, b.isbn)
    // }

    for (b in books) {
        console.log("Adding to collection", books[b])
        addtocollection("hindiCollection", books[b], books[b].isbn)
    }

    function parseData(data) {
      b = {
        timestamp: Date.now(),
        isbn: data.isbn,
        name: data.name,
        author: data.collection,
        imageURL: data.productImageUrl,
        price: data.price,
      };

      books.push(b);
    }
    return;
});


exports.downloadBooks = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    const fs = require("fs");

    const documents = [];

    async function getBooks(documents) {
      const snapshot = await db.collection('hindiCollection').get()
      snapshot.forEach(doc => {
         documents[doc.id] = doc.data();
      });
      return documents;
    }

    await getBooks(documents)

    wixDocuments = []
    for (d in documents) {
      wix = {
        handleId: documents[d]['isbn'],
        fieldType: 'Product',
        name: documents[d]['name'].replace(',', '-'),
        description: documents[d]['name'].replace(',', '-') + ' - ' + documents[d]['author'].replace(',', '-'),
        productImageUrl: documents[d]['image'][0] != undefined ? documents[d]['image'][0]['thumb_url'].split('?')[0] : documents[d]['imageraw'],
        collection: documents[d]['author'],
        isbn: documents[d]['isbn'],
        price: documents[d]['price'],
        visible: 'TRUE',
        inventory: documents[d]['count'],
        additionalInfoTitle1: 'Written By ' + documents[d]['author'].replace(',', '-'),
        additionalInfoDescription1: documents[d]['name'].replace(',', '-') + ' - ' + documents[d]['author'].replace(',', '-'),
      };
      wixDocuments.push(wix)
    }

    function writeToCSVFile(documents) {
      const filename = 'wixHindiCollection1.csv';
      fs.writeFile(filename, extractAsCSV(documents), err => {
        if (err) {
          console.log('Error writing to csv file', err);
        } else {
          console.log(`saved as ${filename}`);
        }
      });
    }
    
    function extractAsCSV(documents) {
      const header = ["handleId, fieldType, name, description, productImageUrl, collection, isbn, price, visible, inventory, additionalInfoTitle1, additionalInfoDescription1"];
      const rows = documents.map(documents =>
         `${documents.handleId}, ${documents.fieldType}, ${documents.name}, ${documents.description}, ${documents.productImageUrl}, ${documents.collection}, ${documents.isbn}, ${documents.price}, ${documents.visible}, ${documents.inventory}, ${documents.additionalInfoTitle1}, ${documents.additionalInfoDescription1}`
      );
      return header.concat(rows).join("\n");
    }

    writeToCSVFile(wixDocuments)

    console.log(wixDocuments)

  });
