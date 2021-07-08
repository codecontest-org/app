import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import clsx from 'clsx';
import { useChild } from '../../../hooks/children';
import { useLiveTeamData } from '../../../hooks/teams';
import { db } from '../../../utils/firebase';

const propTypes = {
  invite: PropTypes.object.isRequired,
  first: PropTypes.bool,
  last: PropTypes.bool
};

const defaultProps = {
  first: false,
  last: false
};

const Invitation = ({ invite: { teamId }, first, last }) => {
  const teamRef = useMemo(() => db.collection('contestTeams').doc(teamId), [teamId]);
  const team = useLiveTeamData(teamRef);
  const ownerRef = useMemo(() => (team?.members.length > 0 ? team.members[0] : null));
  const [owner] = useChild(ownerRef);
  const classes = useStyles();
  return (
    <ListItem
      divider={!last}
      classes={{
        root: clsx([classes.root, { [classes.roundTop]: first, [classes.roundBottom]: last }])
      }}
    >
      <ListItemText disableTypography classes={{ root: classes.text }}>
        <Typography variant="h5" className={classes.name}>
          {team?.name}
        </Typography>
        <Typography variant="body1">
          - {owner?.fName} {owner?.lName}
        </Typography>
      </ListItemText>
      <ListItemSecondaryAction>
        <Button color="secondary" variant="outlined" startIcon={<Check />}>
          Join
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
Invitation.propTypes = propTypes;
Invitation.defaultProps = defaultProps;

const useStyles = makeStyles({
  root: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  roundTop: { borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  roundBottom: { borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  text: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  },
  name: { marginRight: 4 }
});

export default Invitation;
