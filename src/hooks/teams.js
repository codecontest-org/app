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
const liveInvitesDataEffect = onSnapshotDataEffectBase(true, snap => snap.docs.map(toData));
