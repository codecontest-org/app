import { useState, useMemo, useEffect } from 'react';
import { getDataEffectBase, onSnapshotDataEffectBase } from '../utils/effectBases';
import { useAccountRef } from './accounts';
import { toData } from '../utils/helpers';
import { db } from '../utils/firebase';

/* ======================
 * === Children Hooks ===
 * ====================== */

/**
 * Subscribe to the data of a given child reference.
 */
export const useLiveChild = childRef => {
  const [child, setChild] = useState(null);
  const handleError = () => setChild(null);
  useEffect(liveChildDataEffect(childRef, setChild, handleError), [childRef]);
  return child;
};

/**
 * Get the data of each child reference given.
 */
export const useChildren = childRefs => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(childrenDataEffect(childRefs, setChildren, setLoading), [childRefs]);
  return [children, loading];
};

/**
 * Subscribe to the data of of each of the child references given.
 */
export const useLiveChildren = childRefs => {
  const [children, setChildren] = useState([]);
  useEffect(liveChildrenDataEffect(childRefs, setChildren), [childRefs]);
  return children;
};

/**
 * Get the data of each of a parents children.
 */
export const useParentsChildren = () => {
  const [childRefs, setChildRefs] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleError = () => setLoading(false);
  const parentRef = useAccountRef('parents');
  useEffect(parentChildRefsEffect(parentRef, setChildRefs, handleError), [parentRef]);
  useEffect(childrenDataEffect(childRefs, setChildren, setLoading), [childRefs]);
  return [children, loading];
};

/**
 * Subscribe to the data of each of a parents children.
 */
export const useParentsLiveChildren = () => {
  const [childRefs, setChildRefs] = useState([]);
  const [children, setChildren] = useState([]);
  const parentRef = useAccountRef('parents');
  useEffect(parentChildRefsEffect(parentRef, setChildRefs), [parentRef]);
  useEffect(liveChildrenDataEffect(childRefs, setChildren), [childRefs]);
  return children;
};

/**
 * Subscribe to the data of all invites for a child.
 */
export const useLiveChildInvites = id => {
  const [invites, setInvites] = useState([]);
  const refs = useMemo(() => db.collection('contestTeamInvites').where('childId', '==', id), [id]);
  const handleError = () => setInvites([]);
  useEffect(liveInvitesDataEffect(refs, setInvites, handleError), [refs]);
  return invites;
};

/* ===============================
 * === Custom Reusable Effects ===
 * =============================== */

const childrenDataEffect = getDataEffectBase(false);
const liveChildDataEffect = onSnapshotDataEffectBase(true);
const liveChildrenDataEffect = onSnapshotDataEffectBase(false);
const parentChildRefsEffect = onSnapshotDataEffectBase(true, doc => doc.data().children || []);
const liveInvitesDataEffect = onSnapshotDataEffectBase(true, snap => snap.docs.map(toData));
