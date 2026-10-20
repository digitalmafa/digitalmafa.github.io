(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyDERtju4FYjQMq1WOCAa6bHQfWM--OQ6Ps",
    authDomain: "digitalmafa-82068.firebaseapp.com",
    projectId: "digitalmafa-82068",
    storageBucket: "digitalmafa-82068.firebasestorage.app",
    messagingSenderId: "168720557180",
    appId: "1:168720557180:web:4f18a84d0e5be0c187d5f9"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.auth = firebase.auth();
  window.db = firebase.firestore();
})();