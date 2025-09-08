import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import { useCookies } from "react-cookie";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "/images/logo.png";

const settings = ["Logout"];

function ResponsiveAppBar() {
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const location = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // تعريف جميع عناصر القائمة الممكنة
  const allNavItems = [
    { label: "Projects", path: "/projects", roles: ["company", "project_manager", "developer"] },
    { label: "Employees", path: "/employees", roles: ["company", "employee_manager"] },
    { label: "Developers", path: "/developers", roles: ["company", "project_manager", "employee_manager"] },
    { label: "Account Management", path: "/account-management", roles: ["CompanyManager"] },
  ];

  // تصفية عناصر القائمة بناءً على الدور
  const getNavItemsByRole = () => {
    const userRole = cookies.role;
    
    if (!userRole) return [];
    
    return allNavItems.filter(item => 
      item.roles.includes(userRole)
    );
  };

  const navItems = getNavItemsByRole();

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(90deg, #96bbdfff 0%, #42a5f5 100%)",
        color: "white",
        boxShadow: 4,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo + Title (Desktop) */}
          <Avatar src={logo} alt="Logo" sx={{ mr: 1, display: { xs: "none", md: "flex" } }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            Software Company
          </Typography>

          {/* Mobile Menu Icon - يظهر فقط إذا كان هناك عناصر في القائمة */}
          {navItems.length > 0 && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                PaperProps={{
                  sx: {
                    background: "#72a8dfff",
                    color: "white",
                    fontSize: '30px',
                    fontFamily: 'fantasy',
                    fontWeight: '1px',
                    borderRadius: 2,
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={item.path}
                  >
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Title (Mobile) */}
          <Avatar src={logo} alt="Logo" sx={{ mr: 1, display: { xs: "flex", md: "none" } }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              letterSpacing: ".1rem",
            }}
          >
            Software Company
          </Typography>

          {/* Desktop Nav - يظهر فقط إذا كان هناك عناصر في القائمة */}
          {navItems.length > 0 && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: location.pathname === item.path ? "#ffeb3b" : "white",
                    backgroundColor: location.pathname === item.path ? "rgba(255,255,255,0.2)" : "transparent",
                    borderRadius: 3,
                    px: 3,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Menu */}
          <Box sx={{ flexGrow: 0  , position :'fixed' , right:16}}>
            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "#ffffffff" , color:'#5e6d9dff' }}>
                  <LogoutIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                },
              }}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <NavLink
                    to="/"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Typography>{setting}</Typography>
                  </NavLink>
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