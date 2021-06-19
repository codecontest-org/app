import { useEffect, useState } from 'react';
import { onSnapshotDataEffectBase } from '../utils/effectBases';

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

/* ===============================
 * === Custom Reusable Effects ===
 * =============================== */

const liveTeamDataEffect = onSnapshotDataEffectBase(true);
