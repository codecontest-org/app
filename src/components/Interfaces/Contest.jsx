import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Typography, makeStyles } from '@material-ui/core';
import ContestTutorials from '../Contest/Tutorials';

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

const propTypes = {
  useCurrentPage: PropTypes.func.isRequired
};

const ContestInterface = ({ useCurrentPage }) => {
  const [page] = useCurrentPage();
  const classes = useStyles();
  return (
    <Container maxWidth="xl" className={classes.wrapper}>
      <Typography variant="h2" align="center">
        Code Contest Dashboard
      </Typography>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={12} md={5}>
          <ContestTutorials page={page} />
        </Grid>
      </Grid>
    </Container>
  );
};
ContestInterface.propTypes = propTypes;

const useStyles = makeStyles({
  wrapper: {
    paddingTop: 30
  },
  grid: {
    paddingTop: 50
  }
});

export default ContestInterface;
