import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  makeStyles,
  Paper,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  InputBase
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import ClassSignUp from '../Classes/SignUp';
import * as Styled from './styles';
import InfoCardHeader from '../Classes/InfoCardHeader';
import DSUlogo from '../../assets/images/dsu.png';

const propTypes = {
  location: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const DSU_EXAMPLE = {
  logo: DSUlogo,
  maps:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3182.079959868037!2d-113.56743758422124!3d37.10321407988719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80ca5b29bfd1899f%3A0x96dee69b51421265!2sDixie%20State%20University!5e0!3m2!1sen!2sus!4v1581868804818!5m2!1sen!2sus',
  title: 'About Camp',
  about: `Located about hour away from Zion’s National Park, Dixie State University is
dedicated to fields such as Computer Science and Information Tech-nology. Throughout
the year, we hold our after school programs and tutoring here. It is the per-fect
place to attend a camp while enjoying the famous and sunny city, St. George, Utah.`,
  youtube: 'https://www.youtube.com/embed/Rt89gPYeB1c',
  faqs: [
    { q: 'Who Can Attend this Camp', a: 'Anyone of any age.' },
    { q: 'What are the camp hours', a: 'This is a 24/7 camp you code from 8:00 am to 2:30 pm.' },
    {
      q: 'When are opening and closing ceremonies',
      a: 'Opening is at 7:30am, and the closing is at 3:00pm.'
    },
    {
      q: 'What should I bring to camp',
      a:
        'Water, food, phone charger if the is something you whould like to have, a sweatshirt, and lipbalm or your mom will get mad.'
    }
  ]
};

const Fill = ({ className, prompt, isEditing }) => {
  const classes = useStyles();
  return (
    isEditing && (
      <div className={`${className} ${classes.fill}`}>
        <Button>
          <AddIcon />
          {prompt}
        </Button>
      </div>
    )
  );
};

Fill.propTypes = {
  className: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired
};

const ClassInfoInterface = ({ location, db, user }) => {
  const [cls, setCls] = useState({});
  const [foundClass, setFoundClass] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [isEditing] = useState(true);
  const [editTitle, setEditTitle] = useState(cls.title || '');
  const [editAbout, setEditAbout] = useState(cls.about || '');

  useEffect(() => {
    const { pathname } = location;
    if (pathname) {
      db.collection('classes')
        .doc(pathname.replace('/parent/info/', ''))
        .get()
        .then(classDoc => {
          if (classDoc.exists) {
            setCls({ ...classDoc.data(), id: classDoc.id, ref: classDoc.ref });
            setFoundClass(true);
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [location, db]);

  const classInfo = cls.info || {
    logo: '',
    maps: '',
    title: '',
    about: '',
    youtube: '',
    faqs: []
  };
  const classes = useStyles();
  return isLoading ? (
    <Styled.PageContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" style={{ marginBottom: '20px' }}>
        Finding Class...
      </Typography>
      <CircularProgress color="primary" />
    </Styled.PageContent>
  ) : (
    <Styled.PageContent>
      <Typography variant="h3" className={classes.mainHeader}>
        {foundClass ? 'Class Info' : 'Class not found.'}
      </Typography>
      {foundClass && (
        <Paper className={classes.content}>
          <div className={classes.cardWrapper}>
            {(classInfo.logo || classInfo.maps || isEditing) && (
              <div className={classes.right}>
                {(classInfo.logo && (
                  <img src={classInfo.logo} alt="Class_Logo" className={classes.logo} />
                )) || (
                  <Fill className={classes.logoFill} prompt="Add a Logo" isEditing={isEditing} />
                )}
                {(classInfo.maps && (
                  <iframe
                    title="maps"
                    src={classInfo.maps}
                    frameBorder="0"
                    allowFullScreen=""
                    className={classes.maps}
                  ></iframe>
                )) || (
                  <Fill className={classes.mapsFill} prompt="Add a Map" isEditing={isEditing} />
                )}
              </div>
            )}
            <div className={classes.left}>
              <InfoCardHeader cls={cls} hideImage hideAccountType>
                <Button
                  disabled={cls.children.length >= cls.maxStudents}
                  variant="contained"
                  color="primary"
                  onClick={() => setShowSignup(true)}
                >
                  Sign Up!
                </Button>
              </InfoCardHeader>
            </div>
          </div>
          {(classInfo.title || classInfo.about || classInfo.youtube || isEditing) && (
            <div
              className={classes.cardWrapper}
              style={{ borderTop: '2px solid rgba(150,150,150,0.3)' }}
            >
              {(isEditing && (
                <div className={classes.right} style={{ boxSizing: 'border-box', padding: '12px' }}>
                  <InputBase
                    className={classes.titleInput}
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    inputProps={{ style: { textAlign: 'center' } }}
                    placeholder="Add a Title"
                  />
                  <InputBase
                    className={classes.aboutInput}
                    value={editAbout}
                    onChange={e => setEditAbout(e.target.value)}
                    placeholder="Add an About"
                    multiline
                  />
                </div>
              )) ||
                ((classInfo.title || classInfo.about) && (
                  <div
                    className={classes.right}
                    style={{ boxSizing: 'border-box', padding: '12px' }}
                  >
                    <Typography variant="h4">{classInfo.title}</Typography>
                    <Typography variant="body1" style={{ marginBottom: '15px' }}>
                      {classInfo.about}
                    </Typography>
                  </div>
                ))}
              {(classInfo.youtube && (
                <div className={classes.left}>
                  <iframe
                    title="youtube"
                    className={classes.youtube}
                    src={classInfo.youtube}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )) ||
                (isEditing && (
                  <div className={classes.left}>
                    <Fill
                      className={classes.youtubeFill}
                      prompt="Add a Video"
                      isEditing={isEditing}
                    />
                  </div>
                ))}
            </div>
          )}
          {(classInfo.faqs.length > 0 || isEditing) && (
            <div
              className={classes.faqWrapper}
              style={{ borderTop: '2px solid rgba(150,150,150,0.3)' }}
            >
              <Typography variant="h4" className={classes.faqHeader}>
                Important Information
              </Typography>
              {classInfo.faqs.map(faq => (
                <ExpansionPanel key={faq.q} className={classes.faqPanel}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className={classes.summary}
                  >
                    <Typography variant="h6" className={classes.question}>
                      {faq.q}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.details}>
                    <Typography variant="body1" className={classes.answer}>
                      {faq.a}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
              {isEditing ? (
                <Button
                  variant="contained"
                  className={classes.faqPanel}
                  style={{ borderRadius: 0, marginTop: 1 }}
                  onClick={() => {}}
                >
                  <AddIcon />
                  Add a FAQ
                </Button>
              ) : (
                <Button
                  disabled={cls.children.length >= cls.maxStudents}
                  variant="contained"
                  color="primary"
                  className={classes.bottomButton}
                  onClick={() => setShowSignup(true)}
                >
                  Sign Up!
                </Button>
              )}
            </div>
          )}
        </Paper>
      )}
      <ClassSignUp
        open={showSignup}
        onClose={() => setShowSignup(false)}
        cls={cls}
        db={db}
        user={user}
      />
    </Styled.PageContent>
  );
};

ClassInfoInterface.propTypes = propTypes;

const useStyles = makeStyles(theme => ({
  mainHeader: {
    marginBottom: '36px',
    textAlign: 'center'
  },
  content: {
    width: '100%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '30px'
  },
  cardWrapper: {
    width: 'calc(100% - 4px)',
    maxWidth: '1000px',
    minWidth: '300px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap-reverse'
  },
  faqWrapper: {
    width: '100%',
    maxWidth: '1000px',
    minWidth: '300px',
    marginBottom: '30px',
    boxSizing: 'border-box',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  left: {
    width: '60%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1
  },
  right: {
    width: '38%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    paddingBottom: '20px',
    flexGrow: 1
  },
  fill: {
    background: '#ddd',
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    maxWidth: '90%',
    maxHeight: '140px',
    marginBottom: '10px'
  },
  logoFill: {
    width: '90%',
    height: '140px',
    marginBottom: '10px'
  },
  maps: {
    width: '75%',
    height: '250px',
    borderRadius: '3px',
    border: '2px solid rgba(120,120,120,0.3)',
    backgroundColor: 'rgba(120,120,120,0.3)',
    [theme.breakpoints.down('md')]: {
      width: '90%'
    }
  },
  mapsFill: {
    width: '75%',
    height: '250px',
    [theme.breakpoints.down('md')]: {
      width: '90%'
    }
  },
  titleInput: {
    width: '100%',
    fontSize: '34px',
    fontWeight: 'normal',
    lineHeight: '40px',
    letterSpacing: '0.25px',
    color: 'rgba(0,0,0,0.87)'
  },
  aboutInput: {
    width: '100%',
    color: 'rgba(0,0,0,0.87)',
    fontSize: '18px',
    fontWeight: 400,
    letterSpacing: '0.5px',
    lineHeight: '28px',
    marginBottom: '15px'
  },
  youtube: {
    width: '90%',
    height: '350px',
    borderRadius: '3px',
    border: '2px solid rgba(120,120,120,0.3)',
    margin: '10px 0',
    backgroundColor: 'rgba(120,120,120,0.3)',
    [theme.breakpoints.down('xs')]: {
      height: '200px'
    }
  },
  youtubeFill: {
    width: '90%',
    height: '350px',
    margin: '10px 0',
    [theme.breakpoints.down('xs')]: {
      height: '200px'
    }
  },
  faqPanel: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    [theme.breakpoints.down('sm')]: {
      width: '98%'
    }
  },
  faqHeader: {
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem'
    }
  },
  summary: {
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px'
    }
  },
  details: {
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px 12px 12px'
    }
  },
  question: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
      lineHeight: '20px'
    }
  },
  answer: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      lineHeight: '15px'
    }
  },
  bottomButton: {
    width: 'calc(60% - 48px)',
    marginTop: '20px',
    [theme.breakpoints.down('xs')]: {
      width: '98%'
    }
  }
}));

export default withRouter(ClassInfoInterface);
