import React from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, Typography, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import clsx from 'clsx';
import { useLiveChildInvites } from '../../../hooks/children';

const propTypes = {
  whoAmI: PropTypes.object,
  updateToggles: PropTypes.func.isRequired
};

const defaultProps = {
  whoAmI: null
};

const MainScreen = ({ whoAmI, updateToggles }) => {
  const invites = useLiveChildInvites(whoAmI?.id);
  const classes = useStyles();
  return (
    <Paper className={clsx([classes.paper, classes.centerCol])}>
      <Typography variant="h3" align="center">
        Join a Team
      </Typography>
      <Invites invites={invites} />
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        className={classes.mainBtn}
        onClick={() => updateToggles({ showCreate: true })}
      >
        Create a Team
      </Button>
    </Paper>
  );
};
MainScreen.propTypes = propTypes;
MainScreen.defaultProps = defaultProps;

const Invites = ({ invites }) => {
  console.log(invites);
  return invites.map(invite => (
    <Typography key={invite.id} variant="body1">
      You have an invite!
    </Typography>
  ));
};
Invites.propTypes = { invites: PropTypes.array.isRequired };

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box'
  },
  centerCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  mainBtn: {
    margin: '20px 0',
    padding: '6px 40px'
  }
});

export default MainScreen;
