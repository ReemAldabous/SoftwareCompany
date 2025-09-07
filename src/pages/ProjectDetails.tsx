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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Fab,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  Description,
  EmojiEvents,
  TrendingUp,
  PersonAdd,
  Add,
  CheckCircle,
  Cancel,
  Edit,
  Delete,
  Person,
  AccessTime,
  Code,
  Close
} from '@mui/icons-material';
import axios from 'axios';
import { useCookies } from "react-cookie";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const companyId = cookies.companyId;
  
  // حالات الحوارات
  const [addDeveloperDialog, setAddDeveloperDialog] = useState(false);
  const [suggestedDevelopers, setSuggestedDevelopers] = useState([]);
  const [addTaskDialog, setAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 1,
    complexity: 1,
    status: 'created',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // تاريخ بعد أسبوع
    estimateEffort: 0,
    projectId: parseInt(id),
    technologyId: ''
  });

  // حالات التقنيات
  const [projectTechnologies, setProjectTechnologies] = useState([]);
  const [availableTechnologies, setAvailableTechnologies] = useState([]);
  const [addTechDialogOpen, setAddTechDialogOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState("");
 

  // حالة لتخزين ساعات العمل للمطور الجديد
  const [workingHours, setWorkingHours] = useState(0);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // جلب بيانات المشروع
        const projectRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}`, 
          { withCredentials: true }
        );
        setProject(projectRes.data);
        
        // جلب المطورين في المشروع
        const developersRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}/developers`, 
          { withCredentials: true }
        );
        setDevelopers(developersRes.data);
        
        // جلب مهام المشروع
        const tasksRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
          { withCredentials: true }
        );
        setTasks(tasksRes.data);
        
        // جلب تقنيات المشروع
        const techRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}/technologies`, 
          { withCredentials: true }
        );
        setProjectTechnologies(techRes.data);
        
        // جلب التقنيات المتاحة
        const availableTechRes = await axios.get(
          `http://localhost:5243/technologies`, 
          { withCredentials: true }
        );
        setAvailableTechnologies(availableTechRes.data);
        
      } catch (err) {
        console.error(err);
        setError("فشل في تحميل بيانات المشروع");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id, companyId]);

  // اقتراح المطورين المناسبين للمشروع
  const fetchSuggestedDevelopers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/suggest`, 
        { withCredentials: true }
      );
      setSuggestedDevelopers(res.data);
      setAddDeveloperDialog(true);
      // إعادة تعيين ساعات العمل عند فتح الحوار
      setWorkingHours(0);
    } catch (err) {
      console.error(err);
      setError("فشل في تحميل المطورين المقترحين");
    }
  };

  // إضافة مطور إلى المشروع
  const addDeveloperToProject = async (developerId) => {
    try {
      await axios.post(
        `http://localhost:5243/companies/${companyId}/projects/${id}/developers`, 
        {
          developerId,
          projectId: id,
          workingHours: workingHours // إضافة ساعات العمل
        },
        { withCredentials: true }
      );
      
      // تحديث قائمة المطورين
      const developersRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/developers`, 
        { withCredentials: true }
      );
      setDevelopers(developersRes.data);
      
      setAddDeveloperDialog(false);
      setWorkingHours(0); // إعادة تعيين ساعات العمل
    } catch (err) {
      console.error(err);
      setError("فشل في إضافة المطور إلى المشروع");
    }
  };

  // إنشاء مهمة جديدة
  const createTask = async () => {
    try {
      // تحويل التواريخ إلى تنسيق DateOnly (YYYY-MM-DD)
      const formattedTask = {
        ...newTask,
        startDate: formatDateForAPI(newTask.startDate),
        endDate: formatDateForAPI(newTask.endDate),
        technologyId: parseInt(newTask.technologyId)
      };

      await axios.post(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
        formattedTask,
        { withCredentials: true }
      );
      
      // تحديث قائمة المهام
      const tasksRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
        { withCredentials: true }
      );
      setTasks(tasksRes.data);
      
      setAddTaskDialog(false);
      setNewTask({
        title: '',
        description: '',
        priority: 1,
        complexity: 1,
        status: 'created',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimateEffort: 0,
   
        projectId: parseInt(id),
        technologyId: ''
      });
    } catch (err) {
      console.error(err);
      setError("فشل في إنشاء المهمة");
    }
  };

  // تحويل التاريخ إلى تنسيق YYYY-MM-DD
  const formatDateForAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // تحديث حالة المهمة
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.patch(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks/${taskId}`, 
        { status },
        { withCredentials: true }
      );
      
      // تحديث قائمة المهام
      const tasksRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
        { withCredentials: true }
      );
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      setError("فشل في تحديث حالة المهمة");
    }
  };

  // قبول مهمة مكتملة (لزيادة نقاط المبرمج)
  const approveTask = async (taskId) => {
    try {
      await axios.post(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks/${taskId}/accept`, 
        {},
        { withCredentials: true }
      );
      
      // تحديث قائمة المهام
      const tasksRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
        { withCredentials: true }
      );
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      setError("فشل في قبول المهمة");
    }
  };

  // إضافة تقنية إلى المشروع
  const addTechnologyToProject = async () => {
    if (!selectedTech) return;

    try {
      await axios.post(
        `http://localhost:5243/companies/${companyId}/projects/${id}/technologies`,
        {
          technologyId: selectedTech,
          projectId: id,
        },
        { withCredentials: true }
      );

      // تحديث قائمة التقنيات
      const techRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/technologies`, 
        { withCredentials: true }
      );
      setProjectTechnologies(techRes.data);
      
      setAddTechDialogOpen(false);
      setSelectedTech("");
    } catch (err) {
      console.error("فشل في إضافة التقنية", err);
      setError("فشل في إضافة التقنية إلى المشروع");
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      // استخدام التنسيق المناسب إذا كان date-fns متاحاً
      return new Date(dateString).toLocaleDateString('ar-SA');
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
      case 'accepted': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done': return 'مكتملة';
      case 'started': return 'قيد التنفيذ';
      case 'canceled': return 'ملغاة';
      case 'created': return 'منشأة';
      case 'accepted': return 'مقبولة';
      default: return status;
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
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(to left, #1976d2, #1565c0)',
          color: 'white',
          p: 3,
        }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              {project.projectName}
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
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f9f9f9', width:510 }}>
                <Typography variant="body1">
                  {project.description || 'لا يوجد وصف للمشروع'}
                </Typography>
              </Paper>
            </Grid>

            {/* Side Info */}
            </Grid>

            {/* معلومات المشروع في صف واحد */}
            <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmojiEvents color="secondary" sx={{ ml: 1 }} />
                    نقاط المشروع
                  </Typography>
                  <Chip
                    label={project.projectPoints || 0}
                    color="secondary"
                    sx={{
                      fontSize: '1.4rem',
                      height: 50,
                      width: 50,
                      borderRadius: '50%',
                      fontWeight: 'bold'
                    }}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp color="info" sx={{ ml: 1 }} />
                    حالة المشروع
                  </Typography>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarToday sx={{ ml: 1 }} />
                    تواريخ المشروع
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        تاريخ البدء:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(project.startDate)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        تاريخ الانتهاء:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(project.endDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* تقنيات المشروع */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Code sx={{ ml: 1 }} />
                  تقنيات المشروع
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setAddTechDialogOpen(true)}
                >
                  إضافة تقنية
                </Button>
              </Box>
              
              {projectTechnologies.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    لا توجد تقنيات مضافة لهذا المشروع بعد
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {projectTechnologies.map(tech => {
                    const technology = availableTechnologies.find(t => t.id === tech.technologyId);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={tech.id}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {technology ? technology.technologyName : "تقنية غير معروفة"}
                              </Typography>
                              {cookies.role === 'manager' && (
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => removeTechnologyFromProject(tech.technologyId)}
                                >
                                  <Close />
                                </IconButton>
                              )}
                            </Box>
                            
                            {technology?.description && (
                              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                {technology.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* المطورون في المشروع */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  المطورون في المشروع
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<PersonAdd />}
                  onClick={fetchSuggestedDevelopers}
                >
                  إضافة مطور
                </Button>
              </Box>
              
              {developers.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    لا يوجد مطورون في هذا المشروع بعد
                  </Typography>
                </Paper>
              ) : (
                <List>
                  {developers.map(developer => (
                    <ListItem key={developer.id} divider>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Person sx={{ mr: 1 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <ListItemText 
                            primary={developer.name} 
                            secondary={developer.specialization} 
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="textSecondary">
                              {developer.workingHours} ساعة عمل
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <ListItemSecondaryAction>
                        <Chip 
                          label={`${developer.points || 0} نقطة`} 
                          size="small" 
                          color="secondary" 
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* مهام المشروع */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  مهام المشروع
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setAddTaskDialog(true)}
                >
                  إضافة مهمة
                </Button>
              </Box>
              
              {tasks.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    لا توجد مهام في هذا المشروع بعد
                  </Typography>
                </Paper>
              ) : (
                <List>
                  {tasks.map(task => (
                    <ListItem key={task.id} divider>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{task.title}</Typography>
                          <Chip 
                            label={getStatusText(task.status)} 
                            color={getStatusColor(task.status)} 
                            size="small" 
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {task.description}
                        </Typography>
                        <Box sx={{ display: 'flex', mt: 1, gap: 1, flexWrap: 'wrap' }}>
                          <Chip label={`أولوية: ${task.priority}`} size="small" variant="outlined" />
                          <Chip label={`تعقيد: ${task.complexity}`} size="small" variant="outlined" />
                          <Chip label={`جهد متوقع: ${task.estimateEffort} ساعة`} size="small" variant="outlined" />
                          {task.actualEffort > 0 && (
                            <Chip label={`جهد فعلي: ${task.actualEffort} ساعة`} size="small" variant="outlined" />
                          )}
                          <Chip label={task.assignedToName} size="small" variant="outlined" />
                        </Box>
                      </Box>
                      
                      <ListItemSecondaryAction>
                        {/* أزرار التحكم بحالة المهمة حسب الدور والحالة الحالية */}
                        {cookies.role === 'developer' && task.status === 'created' && (
                          <IconButton 
                            color="primary" 
                            onClick={() => updateTaskStatus(task.id, 'started')}
                          >
                            <Edit />
                          </IconButton>
                        )}
                        
                        {cookies.role === 'developer' && task.status === 'started' && (
                          <IconButton 
                            color="success" 
                            onClick={() => updateTaskStatus(task.id, 'done')}
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                        
                        {cookies.role === 'manager' && task.status === 'done' && (
                          <>
                            <IconButton 
                              color="success" 
                              onClick={() => updateTaskStatus(task.id, 'accepted')}
                            >
                              <CheckCircle />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => updateTaskStatus(task.id, 'created')}
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        )}
                        
                        {cookies.role === 'manager' && (
                          <IconButton 
                            color="warning" 
                            onClick={() => updateTaskStatus(task.id, 'canceled')}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
            </Box>
          </CardContent>
        </Card>

        {/* حوار إضافة مطور */}
        <Dialog open={addDeveloperDialog} onClose={() => setAddDeveloperDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>إضافة مطور إلى المشروع</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              المطورون المقترحون للمشروع بناءً على مهاراتهم
            </Typography>
            
            {suggestedDevelopers.length === 0 ? (
              <Typography textAlign="center" py={2}>
                لا يوجد مطورون مقترحون
              </Typography>
            ) : (
              <List>
                {suggestedDevelopers.map(developer => (
                  <Box key={developer.id}>
                    <ListItem divider>
                      <ListItemText 
                        primary={developer.name} 
                        secondary={developer.specialization} 
                      />
                      <ListItemSecondaryAction>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => addDeveloperToProject(developer.id)}
                        >
                          إضافة
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Box sx={{ px: 2, py: 1, backgroundColor: '#f5f5f5' }}>
                      <TextField
                        label="ساعات العمل"
                        type="number"
                        size="small"
                        value={workingHours}
                        onChange={(e) => setWorkingHours(parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                        sx={{ width: '120px' }}
                      />
                    </Box>
                  </Box>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDeveloperDialog(false)}>إلغاء</Button>
          </DialogActions>
        </Dialog>

        {/* حوار إضافة مهمة */}
        <Dialog open={addTaskDialog} onClose={() => setAddTaskDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>إضافة مهمة جديدة</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label="عنوان المهمة"
                  variant="outlined"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="وصف المهمة"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="الأولوية"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}
                  required
                >
                  <MenuItem value={1}>منخفضة</MenuItem>
                  <MenuItem value={2}>متوسطة</MenuItem>
                  <MenuItem value={3}>عالية</MenuItem>
                  <MenuItem value={4}>عاجلة</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="مستوى التعقيد"
                  value={newTask.complexity}
                  onChange={(e) => setNewTask({...newTask, complexity: parseInt(e.target.value)})}
                  required
                >
                  <MenuItem value={1}>بسيط</MenuItem>
                  <MenuItem value={2}>متوسط</MenuItem>
                  <MenuItem value={3}>معقد</MenuItem>
                  <MenuItem value={4}>معقد جداً</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  label="تاريخ البدء"
                  type="date"
                  fullWidth
                  required
                  value={newTask.startDate ? new Date(newTask.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTask({...newTask, startDate: new Date(e.target.value)})}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  label="تاريخ الانتهاء"
                  type="date"
                  fullWidth
                  required
                  value={newTask.endDate ? new Date(newTask.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTask({...newTask, endDate: new Date(e.target.value)})}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  type="number"
                  fullWidth
                  label="الجهد المتوقع (ساعات)"
                  value={newTask.estimateEffort}
                  onChange={(e) => setNewTask({...newTask, estimateEffort: parseFloat(e.target.value) || 0})}
                  inputProps={{ min: 0, step: 0.5 }}
                  required
                />
              </Grid>
              
         
              
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="التقنية المستخدمة"
                  value={newTask.technologyId}
                  onChange={(e) => setNewTask({...newTask, technologyId: e.target.value})}
                  required
                >
                  <MenuItem value="">اختر تقنية</MenuItem>
                  {availableTechnologies.map(tech => (
                    <MenuItem key={tech.id} value={tech.id}>
                      {tech.technologyName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddTaskDialog(false)}>إلغاء</Button>
            <Button 
              onClick={createTask} 
              variant="contained"
              disabled={!newTask.title || !newTask.technologyId}
            >
              إنشاء المهمة
            </Button>
          </DialogActions>
        </Dialog>

        {/* حوار إضافة تقنية */}
        <Dialog open={addTechDialogOpen} onClose={() => setAddTechDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">إضافة تقنية إلى المشروع</Typography>
              <IconButton onClick={() => setAddTechDialogOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              margin="normal"
              label="اختر التقنية"
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
            >
              {availableTechnologies.map((tech) => (
                <MenuItem key={tech.id} value={tech.id}>
                  {tech.technologyName}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
              <Button onClick={() => setAddTechDialogOpen(false)} color="inherit">
                إلغاء
              </Button>
              <Button variant="contained" onClick={addTechnologyToProject}>
                إضافة
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        
  
      </Container>
  );
}

export default ProjectDetails;