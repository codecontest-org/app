import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip, Typography, makeStyles } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import clsx from 'clsx';

const propTypes = {
  backButton: PropTypes.bool,
  onBack: PropTypes.func,
  title: PropTypes.string,
  variant: PropTypes.string,
  classes: PropTypes.object
};

const defaultProps = {
  backButton: false,
  onBack: () => {},
  title: 'Modal Header',
  variant: 'h3',
  classes: {
    root: '',
    title: '',
    button: ''
  }
};

const ModalHeader = ({ title, variant, backButton, onBack, classes }) => {
  const localClasses = useStyles();
  if (backButton) {
    return (
      <div className={clsx([localClasses.header, classes.root])}>
        <div className={localClasses.grow}>
          <Tooltip title="Back" placement="bottom">
            <IconButton onClick={onBack} className={classes.button}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
        </div>
        <Typography variant={variant} className={classes.title}>
          {title}
        </Typography>
        <div className={localClasses.grow}>
          <div style={{ width: 48 }} />
        </div>
      </div>
    );
  }
  return (
    <Typography variant={variant} className={clsx([classes.title, classes.root])}>
      {title}
    </Typography>
  );
};
ModalHeader.propTypes = propTypes;
ModalHeader.defaultProps = defaultProps;

const useStyles = makeStyles({
  header: {
    // margin: '20px 0 0 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  grow: {
    flexGrow: 1
  }
});

export default ModalHeader;
