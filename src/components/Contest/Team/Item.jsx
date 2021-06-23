import React from 'react';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';

const propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node.isRequired };

const InfoItem = ({ title, children }) => {
  const classes = useStyles();
  return (
    <Typography variant="h6" className={classes.infoItem}>
      <strong>{title}</strong>: {children}
    </Typography>
  );
};
InfoItem.propTypes = propTypes;

const useStyles = makeStyles({
  infoItem: {
    marginTop: 15,
    '& a': {
      color: 'var(--pink-color)',
      textDecoration: 'none'
    }
  }
});

export default InfoItem;
