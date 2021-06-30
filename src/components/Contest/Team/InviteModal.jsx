import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles
} from '@material-ui/core';
import Modal, { ModalHeader } from '../../UI/Modal';
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
  const classes = useStyles();
  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Invite Members" backButton onBack={onClose} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <List classes={{ root: classes.listRoot }}>
          {children.map(child => (
            <ListItem key={child.id} divider>
              <ListItemText>
                {child.fName} {child.lName}
              </ListItemText>
              <ListItemSecondaryAction>
                <Button variant="outlined" color="secondary">
                  Invite
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Button onClick={onClose} className={classes.closeBtn}>
        Close
      </Button>
    </Modal>
  );
};
InviteModal.propTypes = propTypes;
InviteModal.defaultProps = defaultProps;

const useStyles = makeStyles({
  listRoot: {
    width: '100%'
  },
  closeBtn: {
    marginTop: 15,
    padding: '6px 32px'
  }
});

export default InviteModal;
