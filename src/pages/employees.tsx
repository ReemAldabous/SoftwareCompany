import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
} from "@mui/material";
import { Edit, Delete, Save, Cancel, Add } from "@mui/icons-material";
import { useCookies } from "react-cookie";
import ResponsiveAppBar from '../components/headerlogin';
import Footer from '../components/footer';

interface Employee {
  id: string;
  fullName: string;
  role: string;
  hiringDate: string;
  birthdate: string;
  salary: string;
}

const EmployeeManager: React.FC = () => {
  const [cookies] = useCookies(["token", "companyId", "role"]);
  const companyid=cookies.companyId
  const API_URL =
    `http://localhost:5243/companies/${cookies.companyId}/employees`;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    fullName: "",
    role: "",
    hiringDate: "",
    birthdate: "",
    salary: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Employee[]>(API_URL, {withCredentials:true});
      setEmployees(response.data);
      console.log(response.data)
    } catch {
      toast.error("فشل في جلب الموظفين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        toast.success("تم تحديث بيانات الموظف بنجاح");
      } else {
        await axios.post(API_URL,{...formData,companyid} ,{withCredentials:true});
        toast.success("تم إضافة الموظف بنجاح");
      }
      handleCloseDialog();
      await fetchEmployees();
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("تم حذف الموظف بنجاح");
        await fetchEmployees();
      } catch {
        toast.error("فشل في حذف الموظف");
      }
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData(employee);
    setEditingId(employee.id);
    setDialogOpen(true);
  };

  const handleOpenDialog = () => {
    setFormData({
      fullName: "",
      role: "",
      hiringDate: "",
      birthdate: "",
      salary: "",
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  return (<>
    <ResponsiveAppBar/>
    <Container maxWidth="lg" sx={{ py: 4 }}>
    
      <ToastContainer position="top-right" autoClose={3000} rtl />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">نظام إدارة الموظفين</Typography>
        <Box>
          <Typography variant="subtitle1" sx={{ mx: 2 }}>
            عدد الموظفين: {employees.length}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
          >
            إضافة موظف
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        ) : employees.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography textAlign="center" color="text.secondary">
                  لا يوجد موظفون مضافون حتى الآن
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          employees.map((emp) => (
            <Grid item xs={12} sm={6} md={4} key={emp.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{emp.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    الدور: {emp.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    تاريخ التعيين: {emp.hiringDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    تاريخ الميلاد: {emp.birthdate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الراتب: {emp.salary} ريال
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(emp)}
                  >
                    تعديل
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDelete(emp.id)}
                  >
                    حذف
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingId ? "تعديل الموظف" : "إضافة موظف جديد"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="employee-form">
            <TextField
              fullWidth
              label="اسم الموظف"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="الدور"
              name="role"
              value={formData.role}
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
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            startIcon={<Cancel />}
          >
            إلغاء
          </Button>
          <Button
            form="employee-form"
            type="submit"
            variant="contained"
            startIcon={<Save />}
            color="primary"
          >
            {editingId ? "حفظ التعديلات" : "إضافة الموظف"}
            {isSubmitting && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
    <Footer/></>
  );
};

export default EmployeeManager;
