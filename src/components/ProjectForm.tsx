import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button, DialogActions } from '@mui/material';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

const statuses = ['created', 'started', 'done', 'canceled'];

function ProjectForm({ onSubmit, onClose, initialData = {}}) {
  const [cookies] = useCookies(['companyId'])
  console.log("edit")
  console.log(initialData)

  const [project, setProject] = useState({
    projectname: initialData.projectName || '',
    description: initialData.description || '',
    projectpoints: initialData.projectPoints || '',
    status: initialData.status || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    managerid: initialData.managerId || 0,
    projectid: initialData.id || ''
  });
  console.log(project)

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(project);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData.id ? 'Edit Project' : 'Add project'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="اسم المشروع" name="projectname" value={project.projectname} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="الوصف" name="description" value={project.description} onChange={handleChange} multiline />
        <TextField fullWidth margin="dense" label="نقاط المشروع" name="projectpoints" value={project.projectpoints} onChange={handleChange} />
         {initialData.id ?<TextField fullWidth margin="dense" select label="الحالة" name="status" value={project.status} onChange={handleChange}>
          {statuses.map(status => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </TextField>: <TextField fullWidth margin="dense" select label="الحالة" name="status" value={project.status} onChange={handleChange}>
        
            <MenuItem key={"created"} value={"created"}>created</MenuItem>
          
        </TextField>}
        <TextField fullWidth margin="dense" type="date" name="startDate" label="تاريخ البدء" InputLabelProps={{ shrink: true }} value={project.startDate} onChange={handleChange} />
        <TextField fullWidth margin="dense" type="date" name="endDate" label="تاريخ الانتهاء" InputLabelProps={{ shrink: true }} value={project.endDate} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData.id ? 'Edit ' : 'Add '}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectForm;
