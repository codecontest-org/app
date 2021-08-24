require('dotenv').config();

const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

/**
 * Setup a firebase app running on local emulators.
 */
function setupFirebase() {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };

  firebase.initializeApp(firebaseConfig);

  firebase.firestore().settings({ host: 'localhost:8080', ssl: false });

  const db = firebase
    .firestore()
    .collection('env')
    .doc('DEVELOPMENT');

  const auth = firebase.auth();

  return { db, auth };
}

/**
 * A firebase auth wrapper.
 * Allows quick auth context switching.
 */
function AuthHandler(auth) {
  this.parent = () => auth.signInWithEmailAndPassword('parent@macuyl.er', '12345678');
  this.teacher = () => auth.signInWithEmailAndPassword('teacher@macuyl.er', '12345678');
  this.admin = () => auth.signInWithEmailAndPassword('admin@macuyl.er', '12345678');
  this.none = auth.signOut;
  this.id = () => auth.currentUser?.uid;
}

/**
 * Helper function for utilizing firebase utilities.
 */
function useFirebase() {
  const { db, auth } = setupFirebase();
  const useAuth = new AuthHandler(auth);
  return { db, auth: useAuth };
}

module.exports = { useFirebase, setupFirebase, AuthHandler };
