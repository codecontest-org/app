const { useFirebase } = require('../utils/firebase');
const { attempt } = require('../utils/helpers');

const { db, auth } = useFirebase();

// Local helpers.
const doc = id => db.collection('admins').doc(id || auth.id());

test('All users can NOT read any admin documents.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.admin();
  const adminDoc = doc();

  /**
   * Test against admins, parents, and anonymous.
   * Parents are considered non-admin users, so it
   * would be redundant to test against teachers.
   */
  await auth.admin();
  await attempt(adminDoc.get(), r => expect(r).toBe(false));

  await auth.parent();
  await attempt(adminDoc.get(), r => expect(r).toBe(false));

  await auth.none();
  await attempt(adminDoc.get(), r => expect(r).toBe(false));
});

test('All users can NOT create an admin document.', async () => {
  expect.assertions(3);

  const data = { secret: 'SUPER_SECRET' };

  /**
   * Test against admins, parents, and anonymous.
   * Parents are considered non-admin users, so it
   * would be redundant to test against teachers.
   */
  await auth.admin();
  await attempt(doc().set(data), r => expect(r).toBe(false));

  await auth.parent();
  await attempt(doc().set(data), r => expect(r).toBe(false));

  await auth.none();
  await attempt(doc().set(data), r => expect(r).toBe(false));
});
