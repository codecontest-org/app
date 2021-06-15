import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Typography, makeStyles } from '@material-ui/core';
import ContestTutorials from '../Contest/Tutorials';
import ContestTeam from '../Contest/Team';

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
  useCurrentPage: PropTypes.func.isRequired,
  useSelectedCls: PropTypes.func,
  whoAmI: PropTypes.object
};

const defaultProps = {
  useSelectedCls: () => {},
  whoAmI: null
};

const ContestInterface = ({ useCurrentPage, useSelectedCls, whoAmI }) => {
  const [page] = useCurrentPage();
  const [cls] = useSelectedCls();
  const classes = useStyles();
  return (
    <Container maxWidth="xl" className={classes.wrapper}>
      <Typography variant="h2" align="center">
        Code Contest Dashboard
      </Typography>
      <Grid container spacing={3} className={classes.grid}>
        <Grid item xs={12} md={4}>
          <ContestTutorials whoAmI={whoAmI} cls={cls} page={page} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ContestTeam />
        </Grid>
      </Grid>
    </Container>
  );
};
ContestInterface.propTypes = propTypes;
ContestInterface.defaultProps = defaultProps;

const useStyles = makeStyles({
  wrapper: {
    paddingTop: 30
  },
  grid: {
    paddingTop: 50
  }
});

export default ContestInterface;
