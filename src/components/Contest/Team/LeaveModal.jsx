import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, makeStyles } from '@material-ui/core';
import Modal, { ModalHeader } from '../../UI/Modal';

const propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func
};

const defaultProps = {
  open: false,
  onClose: () => {},
  onConfirm: () => {}
};

const LeaveModal = ({ open, onClose, onConfirm }) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Leave Team" backButton onBack={onClose} />
      <Typography variant="h5" style={{ marginBottom: 10 }}>
        Are you sure you want to leave this team?
      </Typography>
      <Typography variant="body2" color="textSecondary">
        You will not be able to re-join without being invited by the team owner again.
      </Typography>
      <div className={classes.options}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
LeaveModal.propTypes = propTypes;
LeaveModal.defaultProps = defaultProps;

const useStyles = makeStyles({
  options: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20
  }
});

export default LeaveModal;
