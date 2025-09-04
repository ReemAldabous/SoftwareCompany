import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardActions, 
  Box,
  Chip,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  Tooltip,
  Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectForm from './ProjectForm';
import {
  Edit,
  Delete,
  CalendarToday,
  Person,
  ArrowRightAlt,
  ExpandMore,
  Task,
  MoreVert
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const ExpandButton = styled(IconButton)(({ theme, expanded }) => ({
  transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function ProjectCard({ project, onDelete, onEdit }) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const statusColors = {
    'created': 'success',
    'canceled' :'warning',
    'done': 'default'
    
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card 
          sx={{ 
            minWidth: 300,
            borderRadius: 2,
            boxShadow: hovered ? 6 : 3,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'visible'
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Status Ribbon */}
          <Box sx={{
            position: 'absolute',
            top: 16,
            marginRight:"10px",
            right: -0,
            zIndex: 1
          }}>
            <Chip 
              label={project.status}
              color={statusColors[project.status] || 'default'}
              size="small"
              sx={{ 
                
                fontWeight: 'bold',
                boxShadow: 2,
                px: 1
              }}
            />
          </Box>

          <CardContent 
            onClick={() => navigate(`/projects/${project.id}`)} 
            sx={{ 
              cursor: 'pointer',
              pb: expanded ? 0 : '16px !important'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Task color="primary" sx={{ mr: 1 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: theme => theme.palette.primary.main
                }}
              >
                {project.projectName}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {project.startDate} <ArrowRightAlt fontSize="small" sx={{ mx: 0.5, verticalAlign: 'middle' }} /> {project.endDate}
              </Typography>
            </Box>

        

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 2 }} />
            
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                <Chip 
                  avatar={<Avatar>P</Avatar>}
                  label={`${project.projectPoints} points`}
                  size="small"
                />
            
              </Box>
            </Collapse>
          </CardContent>

          <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
            <Box>
              <Tooltip title="تعديل" arrow TransitionComponent={Fade}>
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMode(true);
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="حذف" arrow TransitionComponent={Fade}>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <ExpandButton
              expanded={expanded}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMore />
            </ExpandButton>
          </CardActions>
        </Card>
      </motion.div>

      {editMode && (
        <ProjectForm
          initialData={project}
          onSubmit={(updatedProject) => {
            onEdit(updatedProject);
            setEditMode(false);
          }}
          onClose={() => setEditMode(false)}
        />
      )}
    </>
  );
}

export default ProjectCard;