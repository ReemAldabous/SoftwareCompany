import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import v from '/images/logo.png'
import  Dialoglogin from './login'
import Dialogsignup from './signup';

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open1, setOpen1] = React.useState(false);
  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };







  
  return (<>
    <AppBar position="static" sx={{ backgroundColor: 'white'  , color:'black'}}>
    <Toolbar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div">
          <img src={v} alt="" style={{width:'15vw',height:'10vh'}} />
        </Typography>
      </Box>
      <Button color="inherit" sx={{ marginRight: 2 , color:'white'     ,fontSize:'20px', borderRadius:'25px'  ,backgroundColor:'rgb(37, 150, 190)'}} onClick={handleClickOpen}>
        Log in
      </Button>
     <Button color="inherit"   sx={{ fontSize:'20px', color:'white' ,  borderRadius:'25px' ,backgroundColor:'rgb(37, 150, 190)' }}   onClick={handleClickOpen1}  >
        SignUp
      </Button>
    </Toolbar>
  </AppBar>
  <Dialoglogin  open={open} handleClose={handleClose}/>
  <Dialogsignup open={open1} handleClose={handleClose1}/>



</>
  )
};

export default Header;