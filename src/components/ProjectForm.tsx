import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button, DialogActions, Box, Typography, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { CalendarToday } from '@mui/icons-material';

const statuses = [
  { value: 'created', label: 'Created' },
  { value: 'started', label: 'Started' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' }
];

function ProjectForm({ onSubmit, onClose, initialData = {} }) {
  const [project, setProject] = useState({
    projectname: initialData.projectName || '',
    description: initialData.description || '',
    projectpoints: initialData.projectPoints || '',
    status: initialData.status || 'created',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    managerid: initialData.managerId || 0,
    projectid: initialData.id || ''
  });

  const handleChange = (e) => setProject({ ...project, [e.target.name]: e.target.value });
  const handleSubmit = () => onSubmit(project);

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 10,
          background: 'linear-gradient(145deg, #ffffffff, #ffffffff)',
          px: 3,
          py: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 700, 
        fontSize: '1.5rem', 
        color: '#2e7896',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
      }}>
        {initialData.id ? 'Edit Project' : 'Add Project'}
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>

          <TextField
            fullWidth
            label="Project Name"
            name="projectname"
            placeholder="Enter project name"
            value={project.projectname}
            onChange={handleChange}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            placeholder="Enter project description"
            value={project.description}
            onChange={handleChange}
            multiline
            minRows={3}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Project Points"
            name="projectpoints"
            placeholder="Enter project points"
            value={project.projectpoints}
            onChange={handleChange}
            variant="outlined"
          />

          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={project.status}
            onChange={handleChange}
            variant="outlined"
          >
            {statuses.map(s => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </TextField>

          <Box display="flex" gap={2}>
            <TextField
              type="date"
              label="Start Date"
              name="startDate"
              InputLabelProps={{ shrink: true }}
              value={project.startDate}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday sx={{ color: '#48abc9' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type="date"
              label="End Date"
              name="endDate"
              InputLabelProps={{ shrink: true }}
              value={project.endDate}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday sx={{ color: '#48abc9' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', mt: 1, mb: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            color: '#2e7896',
            borderColor: '#2e7896',
            px: 4,
            py: 1,
            fontWeight: 600,
            ':hover': { background: '#d4eefb' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #48abc9, #2e7896)',
            px: 5,
            py: 1.2,
            color: 'white',
            fontWeight: 700,
            ':hover': { background: '#2e7896' }
          }}
        >
          {initialData.id ? 'Edit' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectForm;
