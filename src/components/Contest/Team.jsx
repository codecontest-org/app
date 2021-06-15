import React from 'react';
import { Paper, Typography, makeStyles } from '@material-ui/core';

const ContestTeam = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Team Info</Typography>
    </Paper>
  );
};

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box'
  }
});

export default ContestTeam;
