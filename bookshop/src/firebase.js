import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
var firebaseConfig = {
    apiKey: "AIzaSyBSbWl6-e2C7eNJZ_p-JmStcTTKaPrhY00",
    authDomain: "paperback-books-7652f.firebaseapp.com",
    databaseURL: "https://paperback-books-7652f.firebaseio.com",
    projectId: "paperback-books-7652f",
    storageBucket: "paperback-books-7652f.appspot.com",
    messagingSenderId: "436910524200",
    appId: "1:436910524200:web:4d0974ab803668aae3b21d",
    measurementId: "G-C4WTDLWG77"
  };
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const booksCollection = db.collection('books')
const inStockCollection = db.collection('inStock')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  booksCollection,
  inStockCollection
}