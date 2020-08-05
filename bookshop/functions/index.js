// [START import]
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()
const path = require('path');
const csvtojson = require("csvtojson")
const fs = require('fs');
const db = admin.firestore();
var book = require('./Book')


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