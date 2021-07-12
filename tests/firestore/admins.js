const { assertFails } = require('@firebase/rules-unit-testing');
const { testId, docId, userId } = require('./utils/ids');
const { createAdminApp, createUserApp, User } = require('./utils/users');

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
    // Attempt to read test data as authenticated user.
    await assertFails(getDoc(user0, doc0).get());
    // Attempt to read test data as unauthenticated user.
    await assertFails(getDoc(user1, doc0).get());
  } catch {
    passed = false;
  }

  return passed;
}

module.exports = { admins0000 };
