import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  Description,
  EmojiEvents,
  TrendingUp
} from '@mui/icons-material';
import axios from 'axios';
import { useCookies } from "react-cookie";


function ProjectDetails() {
 
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const companyId = cookies.companyId;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5243/companies/${companyId}/projects/${id}`, { withCredentials: true });
        setProject(res.data);
      } catch (err) {
        console.error(err);
        setError("فشل في تحميل بيانات المشروع");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, companyId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: arSA });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'success';
      case 'started': return 'primary';
      case 'canceled': return 'warning';
      case 'created': return 'primary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>جاري تحميل بيانات المشروع...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          رجوع
        </Button>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">لم يتم العثور على المشروع</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          رجوع
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl' }}>
   

      <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(to left, #1976d2, #1565c0)',
          color: 'white',
          p: 3,
        }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              {project.name}
            </Typography>
            <Chip
              label={project.status}
              color={getStatusColor(project.status)}
              sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            />
          </Grid>
        </Box>

        {/* Content */}
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            {/* Description */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ ml: 1 }} />
                وصف المشروع
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                <Typography variant="body1">
                  {project.description || 'لا يوجد وصف للمشروع'}
                </Typography>
              </Paper>
            </Grid>

            {/* Side Info */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEvents color="secondary" sx={{ ml: 1 }} />
                  نقاط المشروع
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <Chip
                    label={project.projectPoints || 0}
                    color="secondary"
                    sx={{
                      fontSize: '1.6rem',
                      height: 60,
                      width: 60,
                      borderRadius: '50%',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="info" sx={{ ml: 1 }} />
                  حالة المشروع
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ ml: 1 }} />
                  تواريخ المشروع
                </Typography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      تاريخ البدء:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(project.startDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      تاريخ الانتهاء:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(project.endDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBack />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold'
                  }}
                >
                  العودة إلى القائمة
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProjectDetails;
