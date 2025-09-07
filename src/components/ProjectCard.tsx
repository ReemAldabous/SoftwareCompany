import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Box,
  Chip,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectForm from './ProjectForm';
import {
  Edit,
  Delete,
  CalendarToday,
  ArrowRightAlt,
  ExpandMore,
  Info,
  CheckCircle,
  Cancel,
  HourglassEmpty
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

  const statusMap = {
    created: { label: "Created", color: "info", icon: <HourglassEmpty fontSize="small" /> },
    canceled: { label: "Canceled", color: "warning", icon: <Cancel fontSize="small" /> },
    done: { label: "Done", color: "success", icon: <CheckCircle fontSize="small" /> },
     started: { label: "Started", color: "info", icon: <CheckCircle fontSize="small" /> },
  };

  const status = statusMap[project.status] || { label: "Unknown", color: "default", icon: null };

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250 }}
      >
        <Card 
          sx={{ 
            minWidth: 340,
            borderRadius: 5,
            boxShadow: hovered ? "0px 8px 24px rgba(0,0,0,0.12)" : "0px 4px 12px rgba(0,0,0,0.08)",
            backdropFilter: "blur(10px)",
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            background: "linear-gradient(145deg, #ffffff 60%, #f7fbff)"
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Header with Avatar */}
          <Box 
            sx={{ 
              background: "linear-gradient(135deg, #48abc9, #2e7896)",
              color: "white",
              px: 2,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar 
                sx={{ 
                  bgcolor: "rgba(255,255,255,0.9)", 
                  color: "primary.main", 
                  fontWeight: "bold" 
                }}
              >
                {project.projectName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {project.projectName}
              </Typography>
            </Box>
            <Chip 
              icon={status.icon}
              label={status.label}
              color={status.color}
              size="small"
              sx={{ fontWeight: "bold", px: 0.5 }}
            />
          </Box>

          {/* Card Body */}
          <CardContent 
            onClick={() => navigate(`/projects/${project.id}`)} 
            sx={{ cursor: 'pointer', pb: expanded ? 0 : 2 }}
          >
            {/* Dates */}
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between" 
              mb={1}
              sx={{ bgcolor: "rgba(72,171,201,0.08)", p: 1.2, borderRadius: 2 }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <CalendarToday fontSize="small" sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.primary" fontWeight={500}>
                  Start: {project.startDate}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <ArrowRightAlt fontSize="small" sx={{ verticalAlign: "middle" }} /> 
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                End: {project.endDate}
              </Typography>
            </Box>

            {/* Expandable Content */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                {project.description || "No description available."}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip 
                  avatar={<Avatar>P</Avatar>}
                  label={`${project.projectPoints} points`}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </Box>
            </Collapse>
          </CardContent>

          {/* Actions */}
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Box>
              <Tooltip title="View details" arrow>
                <IconButton size="small" color="info" onClick={() => navigate(`/projects/${project.id}`)}>
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit" arrow>
                <IconButton size="small" color="primary" onClick={() => setEditMode(true)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton size="small" color="error" onClick={() => onDelete(project.id)}>
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

      {/* Edit Modal */}
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
