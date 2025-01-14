import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography, Chip } from '@material-ui/core';
import { CheckCircle, Block, Info, FiberManualRecord } from '@material-ui/icons';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { getStatus } from '../../../utils/helpers';

const propTypes = {
  account: PropTypes.object.isRequired,
  show: PropTypes.func.isRequired
};

const statusColor = {
  ACCEPTED: 'primary',
  DECLINED: 'default',
  PENDING: 'secondary'
};

const statusIcon = {
  ACCEPTED: CheckCircle,
  DECLINED: Block,
  PENDING: Info
};

const Request = ({ account, show }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.wrapper}
      onClick={() => {
        show(account);
        if (!account.isRead) {
          account.ref.update({ isRead: true });
        }
      }}
    >
      <div className={classes.nameWrapper}>
        {!account.isRead && (
          <FiberManualRecord color="primary" fontSize="small" className={classes.nameNotify} />
        )}
        <Typography variant="h5" className={classes.name}>
          {account.parent.fName} {account.parent.lName}
        </Typography>
      </div>
      <AccountChip status={getStatus(account)} smallBreak="sm" />
    </div>
  );
};

Request.propTypes = propTypes;

export const AccountChip = withWidth()(({ status, smallBreak, onClick, outlined, width }) => {
  const Icon = statusIcon[status];
  return (
    <Chip
      style={{ width: '120px' }}
      label={status}
      icon={<Icon />}
      onClick={onClick}
      variant={outlined ? 'outlined' : 'default'}
      color={statusColor[status]}
      size={isWidthDown(smallBreak, width) ? 'small' : 'medium'}
    />
  );
});

AccountChip.propTypes = {
  status: PropTypes.string.isRequired,
  smallBreak: PropTypes.string,
  onClick: PropTypes.func,
  outlined: PropTypes.bool,
  width: PropTypes.string
};
AccountChip.defaultProps = {
  smallBreak: 'xs',
  onClick: null,
  outlined: false
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '98%',
    padding: '10px 40px',
    boxSizing: 'border-box',
    borderTop: '1px solid rgba(100,100,100,0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 50ms ease',
    '&:hover': {
      boxShadow: '0px 0px 7px 1px rgba(0,0,0,0.1)'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '8px 18px'
    }
  },
  nameWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  nameNotify: {
    marginLeft: -20 - 9,
    marginRight: 9,
    [theme.breakpoints.down('sm')]: {
      marginLeft: -10 - 1,
      marginRight: 1
    }
  },
  name: {
    fontSize: 'default',
    paddingRight: '8px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    }
  }
}));

export default Request;
