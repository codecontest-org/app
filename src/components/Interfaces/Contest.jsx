import React from 'react';
import { Container, Typography, makeStyles } from '@material-ui/core';

/**
 * -- Contest Interface --
 * This is designed to be the hub for everything contestants need during their contest!
 * It should have links to the following pages:
 *  - Tutorials
 *  - Games
 *  - Teams
 *  - Class Select
 *  - Replit setting
 *  - Submission
 *  - Notes?
 */

const ContestInterface = () => {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Typography variant="h2" align="center">
        Code Contest Dashboard
      </Typography>
    </Container>
  );
};

const useStyles = makeStyles({
  container: {
    paddingTop: 20
  }
});

export default ContestInterface;
