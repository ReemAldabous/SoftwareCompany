import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Button, 
  Typography, 
  Box, 
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { useCookies } from "react-cookie";
import ResponsiveAppBar from '../components/headerlogin';
import Footer from '../components/footer';

function Project() {
  const [projects, setProjects] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const companyId = cookies.companyId;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5243/companies/${companyId}/projects`,
        { withCredentials: true }
      );
      setProjects(res.data);
      console.log(cookies.role)
    } catch (err) {
      setError("Failed to fetch projects. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (project) => {
    try {
      const { projectname, description, projectpoints, status, startDate, endDate, managerid } = project;
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `http://localhost:5243/companies/${companyId}/projects`, 
        { projectname, description, projectpoints, status, startDate, endDate, companyid: companyId, managerid },
        { withCredentials: true }
      );
      setProjects([...projects, res.data]);
      setOpenForm(false);
    } catch (err) {
      setError("Failed to add project. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    try {
      await axios.delete(`http://localhost:5243/companies/${companyId}/projects/${id}`, { withCredentials: true });
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError("Failed to delete project. Please try again.");
      console.error(err);
    }
  };

  const handleEdit = async (updatedProject) => {
    try {
      const{projectname , description,projectpoints, endDate,startDate ,status ,managerid}=updatedProject
      console.log("////////////////////")
       console.log(updatedProject)
       console.log(updatedProject.projectid)
      const res = await axios.put(
        `http://localhost:5243/companies/${companyId}/projects/${updatedProject.projectid}`, 
       {projectname, description,projectpoints, endDate,startDate ,status ,managerid ,companyId}, { withCredentials: true }
      );
      const pro=projects.map(p => p.projectid === updatedProject.projectid ? updatedProject : p)
      console.log("new")
       console.log(pro)
      setProjects(pro);
      fetchProjects()
    
    } catch (err) {
      setError("Failed to update project. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ mt: 12, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 , bgcolor:'#b4cce4ff' }}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{color:"blue"}}>
              Projects Mangment
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => setOpenForm(true)}
              sx={{
                backgroundColor: '#da5ec1af',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              Add Project
            </Button>
          </Box>

          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : projects.length === 0 ? (
            <Typography variant="body1" color="textSecondary" textAlign="center" py={4}>
              No projects found. Click "Add New Project" to get started.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {projects.map(project => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={project.projectid}>
                  <ProjectCard
                    project={project}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        <Dialog 
          open={openForm} 
          onClose={() => setOpenForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Create New Project</Typography>
              <IconButton onClick={() => setOpenForm(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <ProjectForm
              onSubmit={handleAddProject}
              onClose={() => setOpenForm(false)}
              companyId={companyId}
              

            />
          </DialogContent>
        </Dialog>
      </Container>
      <Footer/>
    </>
  );
}

export default Project;