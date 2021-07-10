const admin = require('firebase-admin');
const { Child, Class, Parent, Reference, Team, TeamInvite } = require('./mockData');

// Initialize app.
admin.initializeApp();

/**
 * Load Mock Firestore Data. This data can be
 * used to test out cloud functions locally.
 */
function loadMockData() {
  // Parents Collection.
  const parents = [new Parent('Abe', 'Ableton'), new Parent('Bruce', 'Brucerton')];
  // Children Collection.
  const children = [
    new Child('Billy', 'Bob', new Reference({ parents }, 0)),
    new Child('Jimbo', 'Joe', new Reference({ parents }, 1))
  ];

  // Classes Collection.
  const classes = [new Class('Test Class')];
  // Add Children to Classes.
  classes[0].addChild(new Reference({ children }, 0));
  classes[0].addChild(new Reference({ children }, 1));

  // Contest Teams Collection.
  const contestTeams = [new Team('Cool Team', new Reference({ classes }, 0))];
  // Set team owner and first member.
  contestTeams[0].setOwner(parents[0].id);
  contestTeams[0].addMember(new Reference({ children }, 0));

  // Contest Invites Collection.
  const contestTeamInvites = [new TeamInvite(children[1], contestTeams[0])];

  return { parents, children, classes, contestTeams, contestTeamInvites };
}

/**
 * Check to see if mock data has already been loaded.
 */
async function loadedMockData(env) {
  const envRef = admin.firestore().doc(`env/${env}`);
  const envDoc = await envRef.get();
  return envDoc.exists && envDoc.data().loadedMockData === true;
}

/**
 * Write mock firestore data to the local emulator for testing.
 */
async function setupMockData(env) {
  const loaded = await loadedMockData(env);
  if (!loaded) {
    // Load mock data.
    const data = loadMockData();
    const toRef = (col, doc) => admin.firestore().doc(`env/${env}/${col}/${doc.id}`);

    // Save mock data to firestore.
    Object.entries(data).forEach(([collection, docs]) => {
      const toDocRef = doc => toRef(collection, doc);
      console.log('[MOCK] Creating:', collection);
      docs.map(toDocRef).map((ref, i) => ref.set(docs[i].toJSON(admin.firestore(), env)));
    });

    // Set loaded flag.
    admin
      .firestore()
      .doc(`env/${env}`)
      .set({ loadedMockData: true });
  }
}

if (process.env.NODE_ENV === 'production') console.log('This is legit!!');
else setupMockData('DEVELOPMENT');

/**
 * Get a firestore reference.
 */
exports.getRef = ({ params: { env } }, path) => admin.firestore().doc(`env/${env}/${path}`);
