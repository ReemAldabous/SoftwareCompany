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
  Paper,
  Button
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import ResponsiveAppBar from '../components/headerlogin';
import Footer from '../components/footer';

interface Developer {
  id: string;
  fullName: string;
  hiringDate: string;
  birthdate: string;
  salary: string;
}

const DevelopersManager: React.FC = () => {
  const [cookies] = useCookies(["token", "companyId"]);
  const API_URL = `http://localhost:5243/companies/${cookies.companyId}/developers`;

  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Developer, "id">>({
    fullName: "",
    hiringDate: "",
    birthdate: "",
    salary: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
   const [editing, setEditing] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Developer[]>(API_URL, { withCredentials: true });
      setDevelopers(response.data);
    } catch {
      toast.error("فشل في جلب المطورين");
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
       const {accountId, companyId}=editing
      await axios.put(`${API_URL}/${editingId}`, {...formData,accountId, companyId } ,{withCredentials:true});
      toast.success("تم تحديث بيانات المطور بنجاح");
      handleCloseDialog();
      await fetchDevelopers();
    } catch {
      toast.error("حدث خطأ أثناء تحديث البيانات");
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
     setEditing(dev)
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ToastContainer position="top-right" autoClose={3000} rtl />

        <Typography variant="h4" gutterBottom>
          إدارة المطورين
        </Typography>

        {loading ? (
          <Box textAlign="center" my={5}>
            <CircularProgress />
          </Box>
        ) : developers.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            لا يوجد مطورون لعرضهم
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {developers.map((dev) => (
              <Grid item xs={12} sm={6} md={4} key={dev.id}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6">{dev.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    تاريخ التعيين: {dev.hiringDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    تاريخ الميلاد: {dev.birthdate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الراتب: {dev.salary} ريال
                  </Typography>
                  <Box textAlign="right" mt={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(dev)}
                    >
                      تعديل
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog for Editing */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>تعديل بيانات المطور</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} id="edit-form">
              <TextField
                fullWidth
                label="الاسم الكامل"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="date"
                label="تاريخ التعيين"
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
                label="تاريخ الميلاد"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="الراتب"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} startIcon={<Cancel />} color="secondary">
              إلغاء
            </Button>
            <Button
              type="submit"
              form="edit-form"
              variant="contained"
              startIcon={<Save />}
              disabled={isSubmitting}
            >
              حفظ التعديلات
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
