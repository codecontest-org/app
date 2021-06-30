import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Modal from '../../UI/Modal';

const propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

const defaultProps = {
  open: false,
  onClose: () => {}
};

const InviteModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="body1">Hello World</Typography>
    </Modal>
  );
};
InviteModal.propTypes = propTypes;
InviteModal.defaultProps = defaultProps;

export default InviteModal;
