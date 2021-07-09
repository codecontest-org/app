const { getRef } = require('../utils/firestore');

/**
 * Add a new member to a team if an invitation is accepted.
 */
async function handleAnswer({ before, after }, context) {
  const { accepted, teamId, childId } = after.data();
  if (before.data().accepted !== accepted) {
    // They answered the invitation.
    if (accepted === true) {
      // They want to join the team.
      const childRef = getRef(context, `children/${childId}`);
      const teamRef = getRef(context, `contestTeams/${teamId}`);
      const teamDoc = await teamRef.get();
      const { members } = teamDoc.data();
      members.push(childRef);
      teamRef.update({ members });
    }
  }
}

module.exports = { handleAnswer };
