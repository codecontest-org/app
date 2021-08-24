const { useFirebase } = require('../utils/firebase');
const { attempt } = require('../utils/helpers');

const { db, auth } = useFirebase();
let adminDoc = null;

/**
 * Setup a valid admin doc for testing.
 */
beforeAll(async () => {
  await auth.admin();
  const adminId = auth.id();
  adminDoc = db.collection('admins').doc(adminId);
});

test('Admin users can NOT read their own admin document.', async () => {
  expect.assertions(1);
  await auth.admin();
  await attempt(adminDoc.get(), success => expect(success).toBe(false));
});

test('Non-admin users can NOT read any admin documents.', async () => {
  expect.assertions(1);
  await auth.parent();
  await attempt(adminDoc.get(), success => expect(success).toBe(false));
});

test('Unauthenticated users can NOT read any admin documents.', async () => {
  expect.assertions(1);
  await auth.none();
  await attempt(adminDoc.get(), success => expect(success).toBe(false));
});
