import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useScrollTrigger,
  Slide,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle,
  Menu as MenuIcon
} from '@mui/icons-material';
import v from '/images/logo.png';
import Dialoglogin from './login';
import Dialogsignup from './signup';

// Hide on scroll functionality
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="sticky" 
          sx={{ 
          
            color: 'black',
            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))'
          }}
        >
          <Container maxWidth="xl" sx={{  backgroundColor: '#ffffffff'}}>
            <Toolbar sx={{ py: 1 }}>
              {/* Logo */}
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                alignItems: 'center' 
              }}>
                <img 
                  src={v} 
                  alt="Company Logo" 
                  style={{ 
                    width: '180px', 
                    height: 'auto',
                    maxHeight: '70px',
                    objectFit: 'contain'
                  }} 
                />
              </Box>

              {/* Desktop Navigation */}
              {!isMobile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button 
                    color="inherit" 
                    sx={{ 
                      fontSize: '16px', 
                      borderRadius: '25px',
                      backgroundColor: 'transparent',
                      color: 'rgb(37, 150, 190)',
                      border: '2px solid rgb(37, 150, 190)',
                      px: 3,
                      py: 1,
                      fontWeight: '600',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgb(37, 150, 190)',
                        color: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(37, 150, 190, 0.3)'
                      }
                    }} 
                    onClick={handleClickOpen}
                  >
                    Log in
                  </Button>
                  <Button 
                    color="inherit" 
                    sx={{ 
                      fontSize: '16px', 
                      borderRadius: '25px',
                      backgroundColor: 'rgb(37, 150, 190)',
                      color: 'white',
                      px: 3,
                      py: 1,
                      fontWeight: '600',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgb(25, 120, 160)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(37, 150, 190, 0.4)'
                      }
                    }} 
                    onClick={handleClickOpen1}
                  >
                    Sign Up
                  </Button>
                </Box>
              ) : (
                /* Mobile Navigation */
                <Box>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ color: 'rgb(37, 150, 190)' }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    PaperProps={{
                      sx: {
                        mt: 5,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <MenuItem 
                      onClick={() => {
                        handleCloseMenu();
                        handleClickOpen();
                      }}
                      sx={{ 
                        py: 1.5,
                        px: 3,
                        fontWeight: '500'
                      }}
                    >
                      Log in
                    </MenuItem>
                    <MenuItem 
                      onClick={() => {
                        handleCloseMenu();
                        handleClickOpen1();
                      }}
                      sx={{ 
                        py: 1.5,
                        px: 3,
                        fontWeight: '500'
                      }}
                    >
                      Sign Up
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      <Dialoglogin open={open} handleClose={handleClose}/>
      <Dialogsignup open={open1} handleClose={handleClose1}/>
    </>
  );
};

export default Header;