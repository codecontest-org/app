import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Paper, Button } from '@material-ui/core';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { programTypeToText } from '../../globals';

import InfoCardHeader from '../Classes/InfoCardHeader';

const propTypes = {
  classes: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object,
  accounts: PropTypes.object
};

const defaultProps = {
  user: { isSignedIn: false },
  accounts: { helper: true }
};

const ClassSearchInterface = ({ classes, db, location, user, accounts }) => {
  const [classList, setClassList] = useState([]);
  const [showOldClasses] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [filters, setFilters] = useState(Object.keys(programTypeToText));

  useEffect(() => {
    let { pathname } = location;
    let id = '';
    if (pathname.includes('/parent')) {
      pathname = pathname.replace('/parent', '');
    } else {
      setIsPublic(true);
    }
    if (pathname.length > '/search/'.length) {
      id = pathname.replace('/search/', '');
      setSearchId(id);
      db.collection('classes')
        .doc(id)
        .get()
        .then(classDoc => {
          if (classDoc.exists) {
            const classData = { ...classDoc.data(), id: classDoc.id, ref: classDoc.ref };
            setClassList([classData]);
          }
        });
      return;
    }
    return db.collection('classes').onSnapshot(classDocs => {
      const classesData = [];
      classDocs.forEach(classDoc => {
        const classData = { ...classDoc.data(), id: classDoc.id, ref: classDoc.ref };
        classesData.push(classData);
      });
      classesData.sort((a, b) => b.endDate.seconds - a.endDate.seconds);
      setClassList(classesData);
    });
  }, [db, setClassList, location]);

  const toggleFilter = f => {
    const filts = [...filters];
    const i = filts.indexOf(f);
    if (i !== -1) {
      filts.splice(i, 1);
    } else {
      filts.push(f);
    }
    setFilters(filts);
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={classes.headerWrapper}>
        <h1 className={classes.pageHeader}>Class Search</h1>
        <div className={classes.typesWrapper}>
          <p style={{ margin: '0 15px' }}>Filter by:</p>
          {Object.keys(programTypeToText).map(programType => (
            <button
              key={programType}
              className={classes.blankButton}
              onClick={() => toggleFilter(programType)}
            >
              <p
                className={
                  filters.includes(programType) ? classes.typeFilterActive : classes.typeFilter
                }
              >
                {programTypeToText[programType]}
              </p>
            </button>
          ))}
        </div>
      </div>
      {classList.map(cls =>
        ((cls.endDate.seconds * 1000 > Date.now() || showOldClasses) &&
          filters.includes(cls.programType)) ||
        filters.length === 0 ? (
          <Paper key={cls.id} className={classes.cardWrapper}>
            <InfoCardHeader cls={cls} hideImage>
              <div className={classes.buttonWrapper}>
                <Link
                  className={classes.button}
                  to={{ pathname: `/parent/signup/${cls.id}`, state: { signupID: cls.id } }}
                >
                  <Button style={{ width: '100%' }} variant="contained">
                    More Info
                  </Button>
                </Link>
              </div>
            </InfoCardHeader>
          </Paper>
        ) : null
      )}
      {classList.filter(a => a.endDate.seconds * 1000 > Date.now() || showOldClasses).length <= 0 &&
        (searchId ? (
          <h1 style={{ textAlign: 'center', lineHeight: '60px', color: 'rgba(0,0,0,0.8)' }}>
            There is no class available with the id: {searchId} <br /> Make sure you typed the id in
            correctly, and that the class is still active.
          </h1>
        ) : (
          <h1 style={{ textAlign: 'center', lineHeight: '60px', color: 'rgba(0,0,0,0.8)' }}>
            No Classes Available right now.... <br /> Check back later, new classes are added all
            the time!
          </h1>
        ))}
      {isPublic &&
      user.isSignedIn &&
      Object.keys(accounts).includes('parents') &&
      Object.keys(accounts).length === 1 ? (
        <Redirect to={{ pathname: `/parent/search/${searchId}`, state: { searchId } }} />
      ) : null}
    </div>
  );
};

ClassSearchInterface.propTypes = propTypes;
ClassSearchInterface.defaultProps = defaultProps;

const styles = {
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36
  },
  pageHeader: {
    fontWeight: 300,
    fontSize: '48px',
    lineHeight: '56px',
    color: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    margin: 0
  },
  blankButton: {
    outline: 'none',
    border: 'none',
    margin: '0 10px',
    padding: 0,
    background: 'none',
    cursor: 'pointer'
  },
  typesWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  typeFilter: {
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: '0.8rem',
    color: '#8dc63f',
    padding: '2px 8px',
    margin: 0,
    borderRadius: '4px',
    boxSizing: 'border-box',
    lineHeight: '23px',
    border: '1px solid #8dc63f'
  },
  typeFilterActive: {
    backgroundColor: '#8dc63f',
    fontSize: '0.8rem',
    color: '#fff',
    padding: '2px 8px',
    margin: '1px',
    borderRadius: '4px',
    lineHeight: '23px',
    boxSizing: 'border-box'
  },
  cardWrapper: {
    width: '60%',
    maxWidth: '800px',
    alignSelf: 'center',
    marginBottom: 12
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    textDecoration: 'none',
    color: '#fff',
    width: '40%'
  }
};

export default withStyles(styles)(withRouter(ClassSearchInterface));