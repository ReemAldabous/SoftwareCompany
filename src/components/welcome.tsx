import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  useTheme,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import { useCookies } from "react-cookie";
import TimelineIcon from '@mui/icons-material/Timeline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddIcon from '@mui/icons-material/Add'; // تم استيراد أيقونة الإضافة
import { motion } from 'framer-motion';
import Footer from './footer';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#d81b60' },
    background: { default: '#f9fbfe' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial',
    h2: { fontWeight: 700, fontSize: '2.8rem' },
    h6: { fontSize: '1.1rem', fontWeight: 500 },
  },
});

const services = [
  {
    icon: <BusinessCenterIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Project Management',
    desc: 'Organize, monitor, and deliver projects efficiently.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Team Collaboration',
    desc: 'Empower your teams to work together seamlessly.',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Analytics & Reports',
    desc: 'Gain insights into performance with smart dashboards.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Client Support',
    desc: 'Our experts are here to assist you 24/7.',
  },
];

export default function WelcomePage() {
  const muiTheme = useTheme();
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: muiTheme.palette.background.default, minHeight: '100vh', pt: 10 }}>
        {/* زر الانتقال للصفحة الأخرى - يظهر فقط للدور company أو employ manager */}
        {(cookies.role === "company" || cookies.role === "employ manager") && (
          <Box sx={{ 
            position: 'absolute', 
            top: 100, 
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/Activitine')}
              startIcon={<AddIcon />} // إضافة أيقونة الإضافة
              sx={{
                fontWeight: 'bold',
                boxShadow: 2,
                px: 3,
                py: 1,
                borderRadius: 2,
                color:"blue",
                backgroundColor:"white",
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  backgroundColor: '#eafdf9ff'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Activitine
            </Button>
          </Box>
        )}

        <Container maxWidth="lg">
          {/* Header */}
          <Box textAlign="center" mb={8}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <Typography variant="h2" sx={{
                background: 'linear-gradient(to right, #1976d2, #d81b60)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Welcome to Our Project Management Platform
              </Typography>
            </motion.div>
          
          </Box>

          {/* Services Section */}
          <Grid container spacing={4} justifyContent="center">
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      height: '100%',
                    }}
                  >
                    {service.icon}
                    <Typography variant="h6" mt={2}>{service.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {service.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box mt={10}>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}