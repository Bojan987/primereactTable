import React from "react";
import Title from "../components/title";
import {
  AppBar,
  Box,
  Container,
  createStyles,
  CssBaseline,
  
  Link,
  makeStyles,
  
  Toolbar,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  })
);

const About = () => {
  const classes = useStyles();
  return (
    <div className='inner'>
      <Title lineContent='How we get' lineContent2='things done' />
      <p className='other'>
        A character his cache I succeed employed entire been it find the more
        and may the to his their five and towards in lay rippedup, what and so
        endure before for her been decades the few to than would was concept.
      </p>
      
    <>
      <div>
        <title>Multiple File Upload</title>
      </div>
      
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <Typography variant="h6" className={classes.title}>
              Multiple File Upload
            </Typography>

        
          </Toolbar>
        </AppBar>

        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Container>
          <Box marginTop={10}>
            Source code (GitHub):{' '}
           
          </Box>
          <Box>
            YouTube video:{' '}
            <Link href="https://youtu.be/MAw0lQKqjRA">
              https://youtu.be/MAw0lQKqjRA
            </Link>
          </Box>
          <Box marginTop={3}>
          
          </Box>
        </Container>
     
    </>
  
    </div>
  );
};

export default About;
