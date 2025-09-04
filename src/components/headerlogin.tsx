import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import v from '/images/logo.png'
import g from '/images/logout1.png'
import {  Link } from 'react-router-dom';






const settings = ['Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event:any) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event:any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{backgroundColor:'#48abc9ff',color:'coral' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
      
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'rgba(251, 251, 251, 1)',
              textDecoration: 'none',
              fontSize:'25px',
              textShadow:' 10px #f1f4faff'

            
            }}
          >
            Software Company
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon             sx={{width:'50px' , height:'50px' , color:'rgba(239, 244, 246, 1)'}} />
            </IconButton>
            <Menu  
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' ,color:'coral'} }}
            >
            
                <MenuItem key={"projects"} onClick={handleCloseNavMenu} >
                    <Link to="/projects" style={{textDecoration:'none'}}><Typography sx={{ textAlign: 'center'  }}>Projects</Typography></Link> 
                </MenuItem>
                <MenuItem key={"employee"} onClick={handleCloseNavMenu} >
                 <Link to="/employees" style={{textDecoration:'none'}}> <Typography sx={{ textAlign: 'center' }}>Employess</Typography></Link>
              </MenuItem>
              <MenuItem key={"developers"} onClick={handleCloseNavMenu} >
              <Link to="/developers" style={{textDecoration:'none'}}> <Typography sx={{ textAlign: 'center' }}>Developers</Typography></Link>
            </MenuItem>
              
            </Menu>
          </Box>
         
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
                textShadow:'10px #dae1f1ff',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'rgb(242, 247, 248)',
              textDecoration: 'none',
            }}
          >
        
            Software Company

          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'  , marginLeft : '350px'   } }}>
           
                <Link to="/projects" style={{textDecoration:'none'}}> <Button
                key={"projects"}
                onClick={handleCloseNavMenu}
                sx={{ my: 2,color:'rgba(255, 255, 255, 1)', display: 'block' , fontSize:'19px' , marginRight:'10px', textTransform:'none'}}
              >
                projects
              </Button></Link>
               <Link to="/employees" style={{textDecoration:'none'}}><Button
                key={"employes"}
                onClick={handleCloseNavMenu}
                sx={{ my: 2,color:'rgba(255, 255, 255, 1)', display: 'block' , fontSize:'19px' , marginRight:'10px', textTransform:'none'}}
              >
                Employess
              </Button></Link>
               <Link to="/developers" style={{textDecoration:'none'}}>
              <Button
                key={"developers"}
                onClick={handleCloseNavMenu}
                sx={{ my: 2,color:'rgba(247, 251, 253, 1)', display: 'block' , fontSize:'19px' , marginRight:'10px', textTransform:'none'}}
              >
                Developers
              </Button></Link>
            
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                
                <img src={g} alt=""  style={{width:'35px'}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
