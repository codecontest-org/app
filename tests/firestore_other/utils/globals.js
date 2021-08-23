const PERMISSION_DENIED = 'permission-denied';

const denied = error => error?.code === PERMISSION_DENIED;

module.exports = { denied, PERMISSION_DENIED };
