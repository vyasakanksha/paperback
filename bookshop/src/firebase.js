import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyDQJIgWrVPyQi6X9tL-7Y2eH_RVUCmkeOo",
  authDomain: "paperbackcollective.firebaseapp.com",
  databaseURL: "https://paperbackcollective-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "paperbackcollective",
  storageBucket: "paperbackcollective.appspot.com",
  messagingSenderId: "1016403651455",
  appId: "1:1016403651455:web:cf091a3293e7791d20084a"
};
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
// const usersCollection = db.collection('users')
// const booksCollection = db.collection('booksCollection')
const hindiCollection = db.collection('hindiCollection')
// const inStockCollection = db.collection('inStock')

// export utils/refs
export {
  db,
  auth,
  hindiCollection
}