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
  LinearProgress,
  Avatar,
  AvatarGroup,
  CardHeader,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
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
  Close,
  Work,
  Task,
  Science,
  Group
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Dialog states
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
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimateEffort: 0,
    projectId: parseInt(id),
    technologyId: ''
  });

  // Technology states
  const [projectTechnologies, setProjectTechnologies] = useState([]);
  const [availableTechnologies, setAvailableTechnologies] = useState([]);
  const [addTechDialogOpen, setAddTechDialogOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState("");

  // Working hours for new developer
  const [workingHours, setWorkingHours] = useState(0);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // Fetch project data
        const projectRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}`, 
          { withCredentials: true }
        );
        setProject(projectRes.data);
        
        // Fetch project developers
        const developersRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}/developers`, 
          { withCredentials: true }
        );

        const projectDevelopers = developersRes.data;

        const detailedDevelopers = await Promise.all(
          projectDevelopers.map(async (dev) => {
            try {
              const res = await axios.get(
                `http://localhost:5243/companies/${companyId}/developers/${dev.developerId}`,
                { withCredentials: true }
              );
              return { ...dev, ...res.data };
            } catch (err) {
              console.error("Failed to fetch developer data", err);
              return dev;
            }
          })
        );

        setDevelopers(detailedDevelopers);
        
        // Fetch project tasks
        const tasksRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
          { withCredentials: true }
        );
        setTasks(tasksRes.data);
        
        // Fetch project technologies
        const techRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/projects/${id}/technologies`, 
          { withCredentials: true }
        );
        setProjectTechnologies(techRes.data);
        
        // Fetch available technologies
        const availableTechRes = await axios.get(
          `http://localhost:5243/technologies`, 
          { withCredentials: true }
        );
        setAvailableTechnologies(availableTechRes.data);
        
      } catch (err) {
        console.error(err);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id, companyId, addDeveloperDialog]);

  // Fetch suggested developers for the project
  const fetchSuggestedDevelopers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/suggest`, 
        { withCredentials: true }
      );
      const suggested = res.data;

      const detailedSuggested = await Promise.all(
        suggested.map(async (dev) => {
          try {
            const res = await axios.get(
              `http://localhost:5243/companies/${companyId}/developers/${dev.id}`,
              { withCredentials: true }
            );
            return { ...dev, ...res.data };
          } catch (err) {
            console.error("Failed to fetch suggested developer data", err);
            return dev;
          }
        })
      );

      setSuggestedDevelopers(detailedSuggested);
      setAddDeveloperDialog(true);
      setWorkingHours(0);
    } catch (err) {
      console.error(err);
      setError("Failed to load suggested developers");
    }
  };

  // Add developer to project
  const addDeveloperToProject = async (developerId) => {
    try {
      await axios.post(
        `http://localhost:5243/companies/${companyId}/projects/${id}/developers`, 
        {
          developerId,
          projectId: id,
          workHours: workingHours
        },
        { withCredentials: true }
      );
      
      // Update developers list
      const developersRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/developers`, 
        { withCredentials: true }
      );
      setDevelopers(developersRes.data);
      
      setAddDeveloperDialog(false);
      setWorkingHours(0);
    } catch (err) {
      console.error(err);
      setError("Failed to add developer to project because already exit");
    }
  };

  // Create new task
  const createTask = async () => {
    try {
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
      
      // Update tasks list
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
      setError("Failed to create task Unauthorized");
    }
  };

  // Format date to YYYY-MM-DD
  const formatDateForAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update task status
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks/${taskId}/${status}`,null,
        { withCredentials: true }
      );
      
      // Update tasks list
      const tasksRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
        { withCredentials: true }
      );
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to update task status");
    }
  };

  // Approve completed task
  const approveTask = async (taskId) => {
    try {
      await axios.post(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks/${taskId}/accept`, 
        {},
        { withCredentials: true }
      );
      
      // Update tasks list
      const tasksRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/tasks`, 
        { withCredentials: true }
      );
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to approve task");
    }
  };

  // Add technology to project
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

      // Update technologies list
      const techRes = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects/${id}/technologies`, 
        { withCredentials: true }
      );
      setProjectTechnologies(techRes.data);
      
      setAddTechDialogOpen(false);
      setSelectedTech("");
    } catch (err) {
      console.error("Failed to add technology", err);
      setError("Failed to add technology to project because already exit ");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
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
      case 'done': return 'Completed';
      case 'started': return 'In Progress';
      case 'canceled': return 'Canceled';
      case 'created': return 'Created';
      case 'accepted': return 'Accepted';
      default: return status;
    }
  };



  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading project data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="contained">
          Back
        </Button>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Project not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }} variant="contained">
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4  , bgcolor:'#becef8ff'}}>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" fontWeight="700">
          Project Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content Column */}
        <Grid item xs={12} lg={8}>
          {/* Project Header Card */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              p: 3,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight="700">
                  {project.projectName}
                </Typography>
                <Chip
                  label={project.status.toUpperCase()}
                  color={getStatusColor(project.status)}
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.9rem',
                    height: 32,
                    color: 'white'
                  }}
                />
              </Grid>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Description sx={{ mr: 1, color: 'primary.main' }} />
                Project Description
              </Typography>
              <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: '#fafafa', borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {project.description || 'No project description available'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Task sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Project Tasks</Typography>
                </Box>
              }
                  action={
  (cookies.role === "project_manager" )&& (
    <Button 
      variant="contained" 
      startIcon={<Add />}
      onClick={() => setAddTaskDialog(true)}
      size={isMobile ? "small" : "medium"}
    >
      Add Task
    </Button>
  )
}
              sx={{ pb: 1 }}
            />
            <CardContent>
              {tasks.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <Task sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="textSecondary" variant="h6">
                    No tasks created for this project yet
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />}
                    onClick={() => setAddTaskDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Create First Task
                  </Button>
                </Paper>
              ) : (
                <Box>
                  {tasks.map(task => (
                    <Card 
                      key={task.id} 
                      variant="outlined" 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="600">
                                {task.title}
                              </Typography>
                              <Chip 
                                label={getStatusText(task.status)} 
                                color={getStatusColor(task.status)} 
                                size="small" 
                                sx={{ ml: 1, fontWeight: 500 }}
                              />
                            </Box>
                            
                            {task.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {task.description}
                              </Typography>
                            )}
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              <Chip 
                                icon={<AccessTime fontSize="small" />} 
                                label={`${task.estimateEffort}`} 
                                size="small" 
                                variant="outlined" 
                              />
                              <Chip 
                                label={`Priority: ${task.priority}`} 
                                size="small" 
                                variant="outlined" 
                                color={task.priority >= 10 ? "error" : "default"}
                              />
                              <Chip 
                                label={`Complexity: ${task.complexity}`} 
                                size="small" 
                                variant="outlined" 
                              />
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                              {/* Task control buttons based on role and current status */}
                              {cookies.role === 'developer' && task.status === 'created' && (
                                <Tooltip title="Start Task">
                                  <IconButton 
                                    color="primary" 
                                    onClick={() => updateTaskStatus(task.id, 'lock')}
                                    size="large"
                                  > start
                                    <PlayArrow />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              {cookies.role === 'developer' && task.status === 'started' && (
                                <Tooltip title="Mark as Done">
                                  <IconButton 
                                    color="success" 
                                    onClick={() => updateTaskStatus(task.id, 'done')}
                                    size="large"
                                  > Done
                                    <CheckCircle />
                                  </IconButton>
                                </Tooltip>
                              )}
                              
                              {cookies.role === 'project_manager' && task.status === 'done' && (
                                <>
                                  <Tooltip title="Accept Task">
                                    <IconButton 
                                      color="success" 
                                      onClick={() => updateTaskStatus(task.id, 'accept')}
                                      size="large"
                                    >
                                      <CheckCircle />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject Task">
                                    <IconButton 
                                      color="error" 
                                      onClick={() => updateTaskStatus(task.id, 'reject')}
                                      size="large"
                                    >
                                      <Cancel />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              
                              {cookies.role === 'project_manager' && (
                                <Tooltip title="Cancel Task">
                                  <IconButton 
                                    color="warning" 
                                    onClick={() => updateTaskStatus(task.id, 'cancel')}
                                    size="large"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                            
                            <Box sx={{ mt: 1, textAlign: { xs: 'left', sm: 'right' } }}>
                              <Typography variant="caption" color="text.secondary">
                                Start: {formatDate(task.startDate)}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                End: {formatDate(task.endDate)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Column */}
        <Grid item xs={12} lg={4}>
          {/* Project Info Cards */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title="Project Overview"
              sx={{ pb: 1 }}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <EmojiEvents color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="700" color="secondary.main">
                      {project.projectPoints || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Points
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <TrendingUp color="info" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body1" fontWeight="600">
                      {project.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" fontWeight="600">
                        Project Timeline
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Start Date     
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" >
                          {formatDate(project.startDate)    }
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' , ml:5 }}>
                        <Typography variant="caption" color="text.secondary">
                          End Date
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(project.endDate)}
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={50} 
                      sx={{ mt: 2, height: 6, borderRadius: 3 }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Technologies Section */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Science sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Technologies</Typography>
                </Box>
              }
              action={ (cookies.role === "project_manager" )&&
                <IconButton onClick={() => setAddTechDialogOpen(true)} color="primary">
                  <Add />
                </IconButton>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              {projectTechnologies.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                  <Code sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography color="textSecondary">
                    No technologies added
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {projectTechnologies.map(tech => {
                    const technology = availableTechnologies.find(t => t.id === tech.technologyId);
                    return (
                      <Chip
                        key={tech.id}
                        icon={<Code />}
                        label={technology ? technology.technologyName : "Unknown"}
                        variant="outlined"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Developers Section */}
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Group sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Team Members</Typography>
                </Box>
              }
              action={
                  (cookies.role === "project_manager" )&&<Button 
                  variant="outlined" 
                  startIcon={<PersonAdd />}
                  onClick={fetchSuggestedDevelopers}
                  size="small"
                >
                  Add
                </Button>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              {developers.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                  <Group sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography color="textSecondary">
                    No developers assigned
                  </Typography>
                </Paper>
              ) : (
                <List disablePadding>
                  {developers.map(developer => (
                    <ListItem 
                      key={developer.id} 
                      divider 
                      sx={{ 
                        px: 0,
                        transition: 'background-color 0.2s',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                          {developer.fullName ? developer.fullName.charAt(0).toUpperCase() : 'D'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="500">
                            {developer.fullName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <AccessTime fontSize="small" sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {developer.workHours} working hours
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={`${developer.workHours || 0}`} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Developer Dialog */}
      <Dialog open={addDeveloperDialog} onClose={() => setAddDeveloperDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Add Developer to Project</Typography>
          <Typography variant="body2" color="text.secondary">
            Suggested developers based on their skills
          </Typography>
        </DialogTitle>
        <DialogContent>
          {suggestedDevelopers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <PersonAdd sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography>No suggested developers available</Typography>
            </Box>
          ) : (<>  <Box sx={{ px: 2, py: 1.5, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Working Hours:</Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(parseInt(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                      sx={{ width: '120px' }}
                    />
                  </Box>
            <List>
              {suggestedDevelopers.map(developer => (
                <Box key={developer.id}>
                  <ListItem divider>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                        {developer.fullName ? developer.fullName.charAt(0).toUpperCase() : 'D'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{developer.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {developer.score || 0} score
                        </Typography>
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                   <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => addDeveloperToProject(developer.id)}
                      >
                        Add
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                
                </Box>
              ))}
            </List></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDeveloperDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={addTaskDialog} onClose={() => setAddTaskDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Typography variant="h6">Create New Task</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                fullWidth
                label="Task Title"
                variant="outlined"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Description"
                variant="outlined"
                multiline
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                type='number'
                fullWidth
                label="Priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}
                required
              >
           
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                type='number'
                fullWidth
                label="Complexity Level"
                value={newTask.complexity}
                onChange={(e) => setNewTask({...newTask, complexity: parseInt(e.target.value)})}
                required
              >
              
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                fullWidth
                label="Estimated Effort"
                value={newTask.estimateEffort}
                onChange={(e) => setNewTask({...newTask, estimateEffort: parseFloat(e.target.value) || 0})}
                inputProps={{ min: 0, step: 0.5 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                sx={{width:300}}
                select
             
                label="Technology Used"
                value={newTask.technologyId}
                onChange={(e) => setNewTask({...newTask, technologyId: e.target.value})}
                required
              >
                <MenuItem value="">Select Technology</MenuItem>
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
          <Button onClick={() => setAddTaskDialog(false)}>Cancel</Button>
          <Button 
            onClick={createTask} 
            variant="contained"
            disabled={!newTask.title || !newTask.technologyId}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Technology Dialog */}
      <Dialog open={addTechDialogOpen} onClose={() => setAddTechDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Technology to Project</Typography>
            <IconButton onClick={() => setAddTechDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Select Technology"
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
              Cancel
            </Button>
            <Button variant="contained" onClick={addTechnologyToProject}>
              Add
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ProjectDetails;