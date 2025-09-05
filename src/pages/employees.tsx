import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  Work,
  CalendarToday,
  MonetizationOn,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import ResponsiveAppBar from "../components/headerlogin";
import Footer from "../components/footer";

interface Employee {
  id: string;
  fullName: string;
  role: string;
  hiringDate: string;
  birthdate: string;
  salary: string;
}

const EmployeeManager: React.FC = () => {
  const [cookies] = useCookies(["token", "companyId"]);
  const API_URL = `http://localhost:5243/companies/${cookies.companyId}/employees`;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    fullName: "",
    role: "",
    hiringDate: "",
    birthdate: "",
    salary: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Employee[]>(API_URL, {
        withCredentials: true,
      });
      setEmployees(response.data);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
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
      toast.success("Employee updated successfully");
      handleCloseDialog();
      await fetchEmployees();
    } catch {
      toast.error("Error updating employee data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      fullName: employee.fullName,
      role: employee.role,
      hiringDate: employee.hiringDate,
      birthdate: employee.birthdate,
      salary: employee.salary,
    });
    setEditingId(employee.id);
    setEditing(employee);
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
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <ToastContainer position="top-right" autoClose={3000} />

        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          textAlign="center"
          color="primary"
        >
          👨‍💼 Employee Management
        </Typography>

        {loading ? (
          <Box textAlign="center" my={5}>
            <CircularProgress />
          </Box>
        ) : employees.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No employees to display
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {employees.map((emp) => (
              <Grid item xs={12} sm={6} md={4} key={emp.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 4,
                    border: "1px solid #1976d2",
                    backgroundColor: "#fff",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
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
                      {getInitial(emp.fullName)}
                    </Avatar>
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      color="primary"
                    >
                      {emp.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <Work sx={{ mr: 1, fontSize: 18 }} />
                      Role: {emp.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                      Hiring Date: {emp.hiringDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      🎂 Birthdate: {emp.birthdate}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight="bold"
                    >
                      <MonetizationOn sx={{ mr: 1, fontSize: 18 }} />
                      {emp.salary} SAR
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(emp)}
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
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{ fontWeight: "bold", color: "primary.main", textAlign: "center" }}
          >
            ✏️ Edit Employee
          </DialogTitle>
          <DialogContent>
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

              <FormControl
                variant="outlined"
                sx={{ minWidth: 120, mt: 2 }}
                fullWidth
                required
              >
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="employee_manager">Employee Manager</MenuItem>
                  <MenuItem value="project_manager">Project Manager</MenuItem>
                  <MenuItem value="developer">Developer</MenuItem>
                </Select>
              </FormControl>

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
            <Button
              onClick={handleCloseDialog}
              startIcon={<Cancel />}
              color="secondary"
              sx={{ borderRadius: 3 }}
            >
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

export default EmployeeManager;
