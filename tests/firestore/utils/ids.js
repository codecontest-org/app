// Generate an id for a test.
function testId(name, i) {
  const testNum = String(i).padStart(4, '0');
  return `${name}${testNum}`;
}

// Generate an id for a document.
function docId(pid, i) {
  const docNum = String(i).padStart(2, '0');
  return `${pid}-doc${docNum}`;
}

// Generate an id for a user.
function userId(pid, i) {
  const userNum = String(i).padStart(2, '0');
  return `${pid}-user${userNum}`;
}

module.exports = { testId, docId, userId };
