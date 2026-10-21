
const firebaseConfig = {
  apiKey: "AIzaSyAQ8EIHFOCIuG6CSXjIQukvdYBYHgMCgZs",
  authDomain: "digitalmafa-c8235.firebaseapp.com",
  projectId: "digitalmafa-c8235",
  storageBucket: "digitalmafa-c8235.firebasestorage.app",
  messagingSenderId: "33066064717",
  appId: "1:33066064717:web:805829f097ee69b9ad7504"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Connect Authentication and Firestore
window.auth = firebase.auth();
window.db = firebase.firestore();

console.log("DigitalMAFA Firebase connected successfully!");
