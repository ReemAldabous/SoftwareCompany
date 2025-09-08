import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Edit, Save, Cancel, Code, CalendarToday, MonetizationOn } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import ResponsiveAppBar from "../components/headerlogin";
import Footer from "../components/footer";

interface Developer {
  id: string;
  fullName: string;
  hiringDate: string;
  birthdate: string;
  salary: string;
}

const DevelopersManager: React.FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token", "companyId"]);
  const API_URL = `http://localhost:5243/companies/${cookies.companyId}/developers`;

  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Developer, "id">>({
    fullName: "",
    hiringDate: "",
    birthdate: "",
    salary: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchDevelopers = async () => {
    
    try {
      setLoading(true);
      const response = await axios.get<Developer[]>(API_URL, {
        withCredentials: true,
      });
      setDevelopers(response.data);
    } catch {
      toast.error("Failed to fetch developers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setIsSubmitting(true);
    try {
      const { accountId, companyId } = editing as any;
      await axios.put(
        `${API_URL}/${editingId}`,
        { ...formData, accountId, companyId },
        { withCredentials: true }
      );
      toast.success("Developer updated successfully");
      handleCloseDialog();
      await fetchDevelopers();
    } catch {
      toast.error("Error while updating developer data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (dev: Developer) => {
    setFormData({
      fullName: dev.fullName,
      hiringDate: dev.hiringDate,
      birthdate: dev.birthdate,
      salary: dev.salary,
    });
    setEditingId(dev.id);
    setEditing(dev);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ py: 4 , mt:7}}>
        <ToastContainer position="top-right" autoClose={3000} />

        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          textAlign="center"
          color="primary"
        >
          👨‍💻 Developers Management
        </Typography>

        {loading ? (
          <Box textAlign="center" my={5}>
            <CircularProgress />
          </Box>
        ) : developers.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No developers to display
          </Typography>
        ) : (
          <Grid container spacing={4} sx={{backgroundColor:'#f4ffffff'}}>
            {developers.map((dev) => (
              <Grid item xs={12} sm={6} md={4} key={dev.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 4,
                    ml:2,
                    border: "1px solid #1976d2",
                    backgroundColor: "#fff",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center" ,cursor: 'pointer' }}  onClick={() => navigate(`/developers/${dev.id}`)} >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 70,
                        height: 70,
                        mx: "auto",
                        mb: 2,
                        fontSize: 28,
                        fontWeight: "bold",
                      }}
                    >
                      {getInitial(dev.fullName)}
                    </Avatar>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      color="primary"
                    >
                      {dev.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                      Hiring Date: {dev.hiringDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      🎂 Birthdate: {dev.birthdate}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight="bold"
                    >
                      <MonetizationOn sx={{ mr: 1, fontSize: 18 }} />
                      {dev.salary} SAR
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(dev)}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        textTransform: "none",
                      }}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog for Editing */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center" }}
          >
            ✏️ Edit Developer
          </DialogTitle>
          <DialogContent >
            <form onSubmit={handleSubmit} id="edit-form">
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="date"
                label="Hiring Date"
                name="hiringDate"
                value={formData.hiringDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                type="date"
                label="Birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </form>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, justifyContent: "center" }}>
            <Button onClick={handleCloseDialog} startIcon={<Cancel />} color="secondary" sx={{ borderRadius: 3 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-form"
              variant="contained"
              startIcon={<Save />}
              disabled={isSubmitting}
              sx={{ borderRadius: 3 }}
            >
              Save Changes
              {isSubmitting && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
};

export default DevelopersManager;
