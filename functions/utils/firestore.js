const admin = require('firebase-admin');
const { Child, Class, Parent, Team, TeamInvite } = require('./mockData');

// Initialize app.
admin.initializeApp();

function loadTestData() {
  const parents = [new Parent('Abe', 'Ableton'), new Parent('Bruce', 'Brucerton')];
  const kids = [new Child('Billy', 'Bob', parents[0]), new Child('Jimbo', 'Joe', parents[1])];
  const classes = [new Class('Test Class')];
  const teams = [new Team('Cool Team')];
  classes[0].addChild(kids[0]);
  classes[0].addChild(kids[1]);
  teams[0].addMember(kids[0]);
  teams[0].setOwner(kids[0].parent);
  const invites = [new TeamInvite(kids[1], teams[0])];
}

if (process.env.NODE_ENV === 'production') console.log('This is legit!!');
else loadTestData();

/**
 * Get a firestore reference.
 */
exports.getRef = ({ params: { env } }, path) => admin.firestore().doc(`env/${env}/${path}`);
