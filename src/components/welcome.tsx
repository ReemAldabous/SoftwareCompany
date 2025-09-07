import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  useTheme,
  alpha,
  Paper,
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import { useCookies } from "react-cookie";
import TimelineIcon from '@mui/icons-material/Timeline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion, useScroll, useTransform } from 'framer-motion';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

const theme = createTheme({
  palette: {
    primary: { 
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293'
    },
    secondary: { 
      main: '#d81b60',
      light: '#e33371',
      dark: '#c2185b'
    },
    background: { 
      default: 'linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%)',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', Roboto, Arial, sans-serif",
    h2: { 
      fontWeight: 800, 
      fontSize: { xs: '2.2rem', md: '3.2rem' },
      letterSpacing: '-0.5px',
      lineHeight: 1.2
    },
    h4: {
      fontWeight: 700,
      fontSize: { xs: '1.5rem', md: '2rem' },
    },
    h6: { 
      fontSize: '1.15rem', 
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.05rem',
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 16,
  },
});

const services = [
  {
    icon: <BusinessCenterIcon sx={{ fontSize: 50 }} />,
    title: 'Project Management',
    desc: 'Organize, monitor, and deliver projects efficiently with our advanced tools.',
    color: '#1976d2',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 50 }} />,
    title: 'Team Collaboration',
    desc: 'Empower your teams to work together seamlessly from anywhere.',
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)'
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 50 }} />,
    title: 'Advanced Analytics',
    desc: 'Gain insights with detailed analytics and performance metrics.',
    color: '#00bcd4',
    gradient: 'linear-gradient(135deg, #00bcd4 0%, #26c6da 100%)'
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 50 }} />,
    title: 'Client Support',
    desc: 'Provide excellent user experience with our support tools.',
    color: '#3f51b5',
    gradient: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)'
  },
];

// مكون فقاعة الخلفية المتحركة المحسنة
const Bubble = ({ size, position, color, opacity, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: opacity,
        scale: 1,
        y: [0, -40, 0],
        x: [0, Math.random() * 20 - 10, 0]
      }}
      transition={{ 
        duration: 8 + Math.random() * 10,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${alpha(color, 0.7)}, ${alpha(color, 0.1)})`,
        ...position,
        zIndex: 0,
        filter: 'blur(4px)'
      }}
    />
  );
};

// مكون جديد لشريط التمرير المتحرك
const ScrollingText = () => {
  return (
    <Box sx={{ 
      overflow: 'hidden', 
      position: 'relative', 
      height: 60, 
      backgroundColor: alpha('#1976d2', 0.08),
      borderRadius: 2,
      my: 6,
      border: `1px solid ${alpha('#1976d2', 0.1)}`
    }}>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ 
          whiteSpace: 'nowrap', 
          display: 'inline-block',
          padding: '20px 0'
        }}
      >
        <Typography variant="h6" sx={{ 
          display: 'inline', 
          marginRight: 8, 
          color: 'primary.main',
          fontWeight: 600
        }}>
          ✦ Streamline Your Workflow ✦ Increase Productivity ✦ Enhance Collaboration ✦ 
          Improve Efficiency ✦ Deliver Projects Faster ✦
        </Typography>
      </motion.div>
    </Box>
  );
};

export default function WelcomePage() {
  const muiTheme = useTheme();
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const navigate = useNavigate();
  const ref = useRef(null);
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);
  
  useEffect(() => {
    // تأثيرات إضافية عند التحميل
  }, []);

  // فقاعات الخلفية المحسنة
  const bubbles = [
    { size: 180, position: { top: '5%', left: '3%' }, color: '#1976d2', opacity: 0.15, delay: 0 },
    { size: 120, position: { top: '15%', right: '8%' }, color: '#d81b60', opacity: 0.12, delay: 0.8 },
    { size: 150, position: { bottom: '10%', left: '10%' }, color: '#5cabecff', opacity: 0.1, delay: 1.6 },
    { size: 90, position: { bottom: '20%', right: '12%' }, color: '#3f51b5', opacity: 0.12, delay: 2.4 },
    { size: 100, position: { top: '60%', left: '20%' }, color: '#00bcd4', opacity: 0.08, delay: 3.2 },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          background: muiTheme.palette.background.default, 
          minHeight: '100vh', 
    
          pt: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* فقاعات الخلفية المتحركة */}
        {bubbles.map((bubble, index) => (
          <Bubble key={index} {...bubble} />
        ))}
        
        {/* زر الانتقال للصفحة الأخرى */}
        {(cookies.role === "company" || cookies.role === "employ manager") && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              position: 'fixed', 
              top: isMobile ? 65 : 100, 
              right: isMobile ? 10 : 20,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Button 
              variant="contained" 
              onClick={() => navigate('/Activitine')}
              startIcon={<AddIcon />}
              sx={{
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                px: 3,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(25, 118, 210, 0.4)',
                  background: 'linear-gradient(45deg, #1565c0, #1e88e5)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Activitine
            </Button>
          </motion.div>
        )}

        <Container maxWidth="lg" ref={ref} sx={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <Box textAlign="center" mb={8}>
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h2" 
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #d81b60 100%)',
                  WebkitBackgroundClip: 'text',
                  fontSize:40,
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  pb: 1,
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #1976d2, transparent)',
                    borderRadius: 2
                  }
                }}
              >
                Welcome to Our Project Management Platform
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
           
            </motion.div>

            {/* شريط التمرير المتحرك */}
            <ScrollingText />
          </Box>

          {/* Services Section */}
          <Grid container spacing={4} justifyContent="center">
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100,
                    damping: 12
                  }}
                  whileHover={{ 
                    y: -12,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      mb:4,
                      borderRadius: 4,
                      backgroundColor: '#fff',
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: `1px solid ${alpha(service.color, 0.15)}`,
                      background: `linear-gradient(135deg, ${alpha(service.color, 0.03)} 0%, ${alpha(service.color, 0.07)} 100%)`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 5,
                        background: service.gradient,
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 30,
                        height: 30,
                        background: alpha(service.color, 0.1),
                        borderTopLeftRadius: 16,
                        transition: 'all 0.3s ease'
                      },
                      '&:hover:after': {
                        width: 50,
                        height: 50
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 5,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Box sx={{ 
                        color: service.color, 
                        mb: 6,
                        p: 2,
                        borderRadius: 3,
                        background: alpha(service.color, 0.1),
                        display: 'inline-flex'
                      }}>
                        {service.icon}
                      </Box>
                    </motion.div>
                    <Typography variant="h6" mt={2} sx={{ fontWeight: 700, color: service.color }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={2} sx={{ flexGrow: 1 }}>
                      {service.desc}
                    </Typography>
                  
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* قسم إضافي مع حركة parallax */}
          <motion.div style={{ opacity, y }}>
            <Paper
              elevation={0}
              sx={{
                mt: 12,
                mb: 8,
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(216, 27, 96, 0.1) 100%)',
                border: `1px solid ${alpha('#1976d2', 0.15)}`,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: alpha('#d81b60', 0.08),
                  zIndex: 0
                },
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -40,
                  left: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: alpha('#1976d2', 0.08),
                  zIndex: 0
                }
              }}
            >
              <Box position="relative" zIndex={1}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                  Ready to Get Started?
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                  Join thousands of teams that are using our platform to manage their projects more efficiently and deliver exceptional results.
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Container>

        <Box mt={10}>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}