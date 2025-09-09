import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast,ToastContainer } from "react-toastify";


// MUI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Chip,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  Close,
  Add,
  Edit,
} from "@mui/icons-material";

export default function DeveloperDetails() {
  const { id } = useParams();
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const companyId = cookies.companyId;

  const [developer, setDeveloper] = useState(null);
  const [developerTechnologies, setDeveloperTechnologies] = useState([]);
  const [availableTechnologies, setAvailableTechnologies] = useState([]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("freshman");
  const [experienceYears, setExperienceYears] = useState(0);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [techToEdit, setTechToEdit] = useState(null);
  const [editExperienceLevel, setEditExperienceLevel] = useState("freshman");
  const [editExperienceYears, setEditExperienceYears] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/developers/${id}`,
          { withCredentials: true }
        );
        setDeveloper(devRes.data);

        const devTechRes = await axios.get(
          `http://localhost:5243/companies/${companyId}/developers/${id}/technologies`,
          { withCredentials: true }
        );
        setDeveloperTechnologies(devTechRes.data);

        const techRes = await axios.get(`http://localhost:5243/technologies`, {
          withCredentials: true,
        });
        setAvailableTechnologies(techRes.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (companyId && id) {
      fetchData();
    }
  }, [companyId, id]);

  const addTechnologyToDeveloper = async () => {
    if (!selectedTech) return;

    try {
      await axios.post(
        `http://localhost:5243/companies/${companyId}/developers/${id}/technologies`,
        {
          technologyId: selectedTech,
          experienceLevel,
          experienceYears,
          developerid: id,
        },
        { withCredentials: true }
      );

      setDeveloperTechnologies((prev) => [
        ...prev,
        {
          technologyId: selectedTech,
          experienceLevel,
          experienceYears,
          developerid: id,
          points: 0,
        },
      ]);
      setAddDialogOpen(false);
      setSelectedTech("");
      setExperienceLevel("freshman");
      setExperienceYears(0);
    } catch (err) {
      console.error("Failed to add technology", err);
      toast.error("this technology already exsit")
      
    }
  };

  const openEditDialog = (tech) => {
    setTechToEdit(tech);
    setEditExperienceLevel(tech.experienceLevel);
    setEditExperienceYears(tech.experienceYears);
    setEditDialogOpen(true);
  };

  const saveEditedTechnology = async () => {
    try {
      await axios.put(
        `http://localhost:5243/companies/${companyId}/developers/${id}/technologies/${techToEdit.technologyId}`,
        {
          technologyId: techToEdit.technologyId,
          experienceLevel: editExperienceLevel,
          experienceYears: editExperienceYears,
          developerid: id,
        },
        { withCredentials: true }
      );

      setDeveloperTechnologies((prev) =>
        prev.map((t) =>
          t.technologyId === techToEdit.technologyId
            ? { ...t, experienceLevel: editExperienceLevel, experienceYears: editExperienceYears }
            : t
        )
      );

      setEditDialogOpen(false);
      setTechToEdit(null);
    } catch (err) {
      console.error("Failed to edit technology", err);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "freshman":
        return "default";
      case "beginner":
        return "primary";
      case "intermediate":
        return "secondary";
      case "advanced":
        return "success";
      default:
        return "default";
    }
  };

  const getLevelPercentage = (level) => {
    switch (level) {
      case "freshman":
        return 25;
      case "beginner":
        return 50;
      case "intermediate":
        return 75;
      case "advanced":
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading developer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-danger mb-3">⚠️ Error</h2>
          <p>{error}</p>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="mb-3">😕 No Developer Data</h2>
          <p>The requested developer could not be found.</p>
        </div>
      </div>
    );
  }

  return ( 
    <div className="container py-5  ">
     <ToastContainer/>
      
      <div className="row g-4">
        {/* Developer Details */}
        <div className="col-12 col-md-4">
     <Card className="rounded-3 shadow-lg border-0">
  <CardContent style={{backgroundColor: '#5c8ee7ff'}}>
    <div className="row text-center g-3">
          <Box 
  textAlign="center" 
  sx={{ color: "white", fontSize: "3rem", fontWeight: "bold" ,height:50  }}
>
   👨‍💻 Developer {developer.fullName}
</Box>
   

   

     
    </div>
  </CardContent>
</Card>

        </div>

        {/* Developer Technologies */}
        <div className="col-12 col-md-8">
          <Card className="shadow border-0">
            <CardContent>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Typography variant="h6" className="fw-bold d-flex align-items-center">
                  🚀  Technical Skills
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setAddDialogOpen(true)}>
                  Add Technology
                </Button>
              </div>

              <div className="d-grid gap-3">
                {developerTechnologies.map((tech) => {
                  const technology =
                    tech.technologyName || availableTechnologies.find((t) => t.id === tech.technologyId);

                  return (
                    <Card key={tech.id} className="shadow-sm">
                      <CardContent>
                        <div className="d-flex ">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <Typography variant="subtitle1" className="fw-bold me-2">
                                {technology ? technology.technologyName : "Unknown"}
                              </Typography>
                              <Chip
                                label={tech.experienceLevel}
                                size="small"
                                color={getLevelColor(tech.experienceLevel)}
                                variant="outlined"
                              />
                            </div>
                            <LinearProgress
                              variant="determinate"
                              value={getLevelPercentage(tech.experienceLevel)}
                              sx={{ height: 6, borderRadius: 5,  width:500, mt:3}}
                            />
                            {technology?.description && (
                              <Typography variant="body2" color="text.secondary" className="mt-2">
                                {technology.description}
                              </Typography>
                            )}
                            <Typography variant="body2" className="mt-1">
                              {tech.experienceYears} years
                            </Typography>
                          </div>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            variant="outlined"
                            color="primary"
                            onClick={() => openEditDialog(tech)}
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Technology Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Technology</Typography>
            <IconButton onClick={() => setAddDialogOpen(false)}>
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

          <TextField
            select
            fullWidth
            margin="normal"
            label="Experience Level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <MenuItem value="freshman">Freshman</MenuItem>
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </TextField>

          <TextField
            type="number"
            fullWidth
            margin="normal"
            label="Years of Experience"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            inputProps={{ min: 0, max: 50 }}
          />

          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            <Button onClick={() => setAddDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button variant="contained" onClick={addTechnologyToDeveloper}>
              Add
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Technology Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Technology</Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Experience Level"
            value={editExperienceLevel}
            onChange={(e) => setEditExperienceLevel(e.target.value)}
          >
            <MenuItem value="freshman">Freshman</MenuItem>
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </TextField>

          <TextField
            type="number"
            fullWidth
            margin="normal"
            label="Years of Experience"
            value={editExperienceYears}
            onChange={(e) => setEditExperienceYears(e.target.value)}
            inputProps={{ min: 0, max: 50 }}
          />

          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            <Button onClick={() => setEditDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button variant="contained" onClick={saveEditedTechnology}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
