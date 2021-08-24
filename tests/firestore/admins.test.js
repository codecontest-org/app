/**
 * Full test coverage for the firestore rules of the admins collection.
 *
 * All tests are run against admin, parent, and anonymous users.
 * Parents are considered non-admin users, so it would be
 * redundant to test against teachers as well.
 */

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

  // Assertions.
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

  // Assertions.
  await auth.admin();
  await attempt(doc().set(data), r => expect(r).toBe(false));

  await auth.parent();
  await attempt(doc().set(data), r => expect(r).toBe(false));

  await auth.none();
  await attempt(doc().set(data), r => expect(r).toBe(false));
});

test('All users can NOT update any admin documents.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.admin();
  const adminDoc = doc();
  const data = { secret: 'SUPER_SECRET' };

  // Assertions.
  await auth.admin();
  await attempt(adminDoc.update(data), r => expect(r).toBe(false));

  await auth.parent();
  await attempt(adminDoc.update(data), r => expect(r).toBe(false));

  await auth.none();
  await attempt(adminDoc.update(data), r => expect(r).toBe(false));
});

test('All users can NOT delete any admin documents.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.admin();
  const adminDoc = doc();

  // Assertions.
  await auth.admin();
  await attempt(adminDoc.delete(), r => expect(r).toBe(false));

  await auth.parent();
  await attempt(adminDoc.delete(), r => expect(r).toBe(false));

  await auth.none();
  await attempt(adminDoc.delete(), r => expect(r).toBe(false));
});
