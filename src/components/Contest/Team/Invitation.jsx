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
import { useChild } from '../../../hooks/children';
import { useLiveTeamData } from '../../../hooks/teams';
import { db } from '../../../utils/firebase';

const propTypes = { invite: PropTypes.object.isRequired };

const Invitation = ({ invite: { teamId } }) => {
  const teamRef = useMemo(() => db.collection('contestTeams').doc(teamId), [teamId]);
  const team = useLiveTeamData(teamRef);
  const ownerRef = useMemo(() => (team?.members.length > 0 ? team.members[0] : null));
  const [owner] = useChild(ownerRef);
  const classes = useStyles();
  return (
    <ListItem>
      <ListItemText disableTypography classes={{ root: classes.text }}>
        <Typography variant="h5" className={classes.name}>
          {team?.name}
        </Typography>
        <Typography variant="body1">
          - {owner?.fName} {owner?.lName}
        </Typography>
      </ListItemText>
      <ListItemSecondaryAction>
        <Button>Join</Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
Invitation.propTypes = propTypes;

const useStyles = makeStyles({
  text: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  },
  name: { marginRight: 2 }
});

export default Invitation;
