import { useEffect, useMemo, useState } from 'react';
import { onSnapshotDataEffectBase } from '../utils/effectBases';
import { toData } from '../utils/helpers';
import { db } from '../utils/firebase';

/* ==================
 * === Team Hooks ===
 * ================== */

/**
 * Subscribe to the data of a team.
 */
export const useLiveTeamData = ref => {
  const [team, setTeam] = useState(null);
  useEffect(liveTeamDataEffect(ref, setTeam), [ref]);
  return team;
};

/**
 * Get a reference to a team in a given
 * class with a given child as a member.
 */
export const useLiveChildsTeamData = (childRef, classRef) => {
  const [team, setTeam] = useState(null);
  const teamRef = useMemo(
    () =>
      db
        .collection('contestTeams')
        .where('members', 'array-contains', childRef)
        .where('classRef', '==', classRef),
    [childRef, classRef]
  );
  const handleError = () => setTeam(null);
  useEffect(liveChildsTeamDataEffect(teamRef, setTeam, handleError), [teamRef]);
  return team;
};

/**
 * Subscribe to the data of all invites for a team.
 */
export const useLiveTeamInvites = id => {
  const [invites, setInvites] = useState([]);
  const refs = useMemo(() => db.collection('contestTeamInvites').where('teamId', '==', id), [id]);
  const handleError = () => setInvites([]);
  useEffect(liveInvitesDataEffect(refs, setInvites, handleError), [refs]);
  return invites;
};

/* ===============================
 * === Custom Reusable Effects ===
 * =============================== */

const liveTeamDataEffect = onSnapshotDataEffectBase(true);
const liveChildsTeamDataEffect = onSnapshotDataEffectBase(true, snap =>
  snap.empty ? null : toData(snap.docs[0])
);
const liveInvitesDataEffect = onSnapshotDataEffectBase(true, snap => snap.docs.map(toData));
