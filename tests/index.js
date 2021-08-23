require('dotenv').config();

const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

const admins = require('./tests/admins');

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

function AuthHandler(auth) {
  this.parent = () => auth.signInWithEmailAndPassword('parent@macuyl.er', '12345678');
  this.teacher = () => auth.signInWithEmailAndPassword('teacher@macuyl.er', '12345678');
  this.admin = () => auth.signInWithEmailAndPassword('admin@macuyl.er', '12345678');
  this.none = auth.signOut;
  this.id = () => auth.currentUser?.uid;
}

/**
 * Attempt quitter creation.
 */
async function test0001(db, auth) {
  await auth.parent();
  const parentDoc = await db
    .collection('parents')
    .doc(auth.id())
    .get();
  const { children } = parentDoc.data();
  const quitData = { childRef: children[0] };
  try {
    await db
      .collection('contestTeamQuitters')
      .doc()
      .set(quitData);
  } catch (error) {
    console.log('OOpps...');
    console.log(error);
  }
}

/**
 * Attempt class name update.
 */
async function test0002(db, auth) {
  await auth.teacher();
  const teacherDoc = await db
    .collection('teachers')
    .doc(auth.id())
    .get();
  const { classes } = teacherDoc.data();
  console.log('My classes:', classes);
  console.log('My class:', classes[0].id);
  try {
    await classes[0].update({ name: 'so H@cked!!' });
  } catch (error) {
    console.log('No good...');
    console.log(error);
  }
}

async function main() {
  const { db, auth } = setupFirebase();
  const useAuth = new AuthHandler(auth);
  await admins.admins0000(db, useAuth);
  await test0001(db, useAuth);
  await test0002(db, useAuth);
  console.log('\n\n\nAll Done!\n\n');
}

main();
