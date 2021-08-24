/**
 * Full test coverage for the firestore rules of the teachers collection.
 *
 * All tests are run against teacher, parent, and anonymous users.
 * Some rules apply to admin users, and are handled accordingly.
 */

const { useFirebase } = require('../utils/firebase');
const { attempt } = require('../utils/helpers');

const { db, auth } = useFirebase();

// Local helpers.
const doc = id => db.collection('teachers').doc(id || auth.id());

test('Authenticated users can read any teacher document.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.teacher();
  const teacherDoc = doc();

  // Assertions.
  await auth.teacher();
  await attempt(teacherDoc.get(), r => expect(r).toBe(true));

  await auth.parent();
  await attempt(teacherDoc.get(), r => expect(r).toBe(true));

  await auth.none();
  await attempt(teacherDoc.get(), r => expect(r).toBe(false));
});

test('Authenticated users can create a teacher document.', async () => {
  expect.assertions(2);

  const data = { location: 'office' };

  // Assertions.
  await auth.parent();
  await attempt(doc().set(data), r => expect(r).toBe(true));

  await auth.none();
  await attempt(doc().set(data), r => expect(r).toBe(false));
});

test('Users can only update their own teacher document.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.teacher();
  const teacherDoc = doc();

  const data0 = { location: 'school' };
  const data1 = { location: 'office' };
  const data2 = { location: 'other' };

  // Assertions.
  await auth.teacher();
  await attempt(teacherDoc.update(data0), r => expect(r).toBe(true));

  await auth.parent();
  await attempt(teacherDoc.update(data1), r => expect(r).toBe(false));

  await auth.none();
  await attempt(teacherDoc.update(data2), r => expect(r).toBe(false));
});

test('Administrators can update any teacher document.', async () => {
  expect.assertions(1);

  // Setup test document.
  await auth.teacher();
  const teacherDoc = doc();

  const data = { location: 'office' };

  // Assertions.
  await auth.admin();
  await attempt(teacherDoc.update(data), r => expect(r).toBe(true));
});

test('Users can only delete their own parent document.', async () => {
  expect.assertions(4);

  // Setup test document.
  await auth.teacher();
  const teacherDoc = doc();

  // Assertions.
  await auth.none();
  await attempt(teacherDoc.delete(), r => expect(r).toBe(false));

  await auth.parent();
  await attempt(teacherDoc.delete(), r => expect(r).toBe(false));

  await auth.admin();
  await attempt(teacherDoc.delete(), r => expect(r).toBe(false));

  await auth.teacher();
  await attempt(teacherDoc.delete(), r => expect(r).toBe(true));
});
