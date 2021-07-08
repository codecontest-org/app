import React from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, Typography, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import clsx from 'clsx';
import { useLiveChildInvites } from '../../../hooks/children';
import Invitation from './Invitation';

const propTypes = {
  cls: PropTypes.object,
  whoAmI: PropTypes.object,
  updateToggles: PropTypes.func.isRequired
};

const defaultProps = {
  cls: null,
  whoAmI: null
};

const MainScreen = ({ cls, whoAmI, updateToggles }) => {
  const invites = useLiveChildInvites(whoAmI?.id, cls?.id);
  const classes = useStyles();
  return (
    <Paper className={clsx([classes.paper, classes.centerCol])}>
      <Typography variant="h3" align="center">
        Join a Team
      </Typography>
      {invites.map(i => (
        <Invitation key={i.id} invite={i} />
      ))}
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
