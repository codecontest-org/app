const { assertFails } = require('@firebase/rules-unit-testing');
const { testId, docId, userId } = require('./utils/ids');
const { createAdminApp, createUserApp, User, cleanup } = require('./utils/users');

const env = 'PRODUCTION';
const name = 'admins';
const email = 'admin@test.app';

const tid = i => testId(name, i);
const getDoc = (user, documentId) =>
  user
    .firestore()
    .collection('env')
    .doc(env)
    .collection(name)
    .doc(documentId);

async function admins0000() {
  const about = 'Test read permissions for the admins collection.';
  const id = tid(0);
  const uid = i => userId(id, i);
  const did = i => docId(id, i);

  const admin = createAdminApp(id);
  const user0 = createUserApp(id, new User(uid(0), email));
  const user1 = createUserApp(id, null);

  const doc0 = did(0);
  const data0 = { secret: 'super' };

  // Load test data.
  await getDoc(admin, doc0).set(data0);

  let passed = true;
  try {
    // Attempt to read a doc as an authenticated user.
    await assertFails(getDoc(user0, doc0).get());
    // Attempt to read a doc as an unauthenticated user.
    await assertFails(getDoc(user1, doc0).get());
  } catch {
    passed = false;
  }

  await cleanup(id, [admin, user0, user1]);

  return [id, about, passed];
}

async function admins0001() {
  const about = 'Test create permissions for the admins collection.';
  const id = tid(1);
  const uid = i => userId(id, i);
  const did = i => docId(id, i);

  const user0 = createUserApp(id, new User(uid(0), email));
  const user1 = createUserApp(id, null);

  const doc0 = did(0);
  const doc1 = did(1);
  const data0 = { secret: 'duper' };

  let passed = true;
  try {
    // Attempt to create a doc as an authenticated user.
    await assertFails(getDoc(user0, doc0).set(data0));
    // Attempt to create a doc as an unauthenticated user.
    await assertFails(getDoc(user1, doc1).set(data0));
  } catch {
    passed = false;
  }

  await cleanup(id, [user0, user1]);

  return [id, about, passed];
}

async function admins0002() {
  const about = 'Test update permissions for the admins collection.';
  const id = tid(2);
  const uid = i => userId(id, i);
  const did = i => docId(id, i);

  const admin = createAdminApp(id);
  const user0 = createUserApp(id, new User(uid(0), email));
  const user1 = createUserApp(id, null);

  const doc0 = did(0);
  const data0 = { secret: 'looper' };
  const data1 = { secret: 'change' };

  // Load test data.
  await getDoc(admin, doc0).set(data0);

  let passed = true;
  try {
    // Attempt to update a doc as an authenticated user.
    await assertFails(getDoc(user0, doc0).update(data1));
    // Attempt to update a doc as an unauthenticated user.
    await assertFails(getDoc(user1, doc0).update(data1));
  } catch {
    passed = false;
  }

  await cleanup(id, [admin, user0, user1]);

  return [id, about, passed];
}

async function admins0003() {
  const about = 'Test delete permissions for the admins collection.';
  const id = tid(3);
  const uid = i => userId(id, i);
  const did = i => docId(id, i);

  const admin = createAdminApp(id);
  const user0 = createUserApp(id, new User(uid(0), email));
  const user1 = createUserApp(id, null);

  const doc0 = did(0);
  const data0 = { secret: 'scooper' };

  // Load test data.
  await getDoc(admin, doc0).set(data0);

  let passed = true;
  try {
    // Attempt to delete a doc as an authenticated user.
    await assertFails(getDoc(user0, doc0).delete());
    // Attempt to delete a doc as an unauthenticated user.
    await assertFails(getDoc(user1, doc0).delete());
  } catch {
    passed = false;
  }

  await cleanup(id, [admin, user0, user1]);

  return [id, about, passed];
}

module.exports = [admins0000, admins0001, admins0002, admins0003];
