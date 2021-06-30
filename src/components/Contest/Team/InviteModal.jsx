import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Typography } from '@material-ui/core';
import Modal from '../../UI/Modal';
import { useChildren } from '../../../hooks/children';

const propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  cls: PropTypes.object
};

const defaultProps = {
  open: false,
  onClose: () => {},
  cls: null
};

const InviteModal = ({ open, onClose, cls }) => {
  const [children, isLoading] = useChildren(cls?.children);
  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h3">Invite Members</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        children.map(child => (
          <Typography variant="body1" key={child.id}>
            {child.fName}
          </Typography>
        ))
      )}
    </Modal>
  );
};
InviteModal.propTypes = propTypes;
InviteModal.defaultProps = defaultProps;

export default InviteModal;
