const { useFirebase } = require('../utils/firebase');
const { attempt } = require('../utils/helpers');
// const { PERMISSION_DENIED } = require('../utils/globals');

const { db, auth } = useFirebase();

function sum(a, b) {
  return a + b;
}

test('adds 1 + 1 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('Verify read permissions for the admins collection', async () => {
  expect.assertions(1);
  await auth.admin();
  const adminDoc = db.collection('admins').doc(auth.id());
  await attempt(adminDoc.get(), success => expect(success).toBe(false));
});
