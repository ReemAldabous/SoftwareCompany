import { useState, ChangeEvent, FormEvent } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Box,
  LinearProgress,
  InputAdornment,
  IconButton,
  Fade
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Close
} from "@mui/icons-material";


interface DialogLoginProps {
  open: boolean;
  handleClose: () => void;
}

const Dialoglogin: React.FC<DialogLoginProps> = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["token", "companyId", "role"]);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5290/login", form);
      const { token, cookieData } = response.data;

      setCookie("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 });
      setCookie("companyId", cookieData.companyId, { path: "/", maxAge: 60 * 60 * 24 * 7 });
      setCookie("role", cookieData.role, { path: "/", maxAge: 60 * 60 * 24 * 7 });

      setLoading(false);
      handleClose();
      navigate("/home");
    } catch (err) {
      console.error(err);
      setLoading(false);

      if (err.response?.status === 422) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError("unexcpected error please sign up first or wait activation");
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
       
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={400}
    >
      <DialogTitle
        sx={{
          fontSize: "28px",
          fontWeight: "bold",
          textAlign: "center",
          color: "white",
          backgroundColor: "linear-gradient(135deg, #2886a9 0%, #1c6c8c 100%)",
          background: "linear-gradient(135deg, #2886a9 0%, #1c6c8c 100%)",
          py: 2,
          position: "relative",
           borderRadius: "9px 70px 0px 0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1
        }}
      >
        <Person sx={{ fontSize: 32 }} />
        <span>Log in </span>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            left: 16,
            color: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 4, px: 3 }}>
          <DialogContentText 
            sx={{ 
              textAlign: "center", 
              mb: 3, 
              color: "text.secondary",
              fontSize: "0.95rem"
            }}
          >
           Please enter your name address and password.
          </DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            name="username"
            label="user name"
            type="text"
            fullWidth
            value={form.username}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            required
            margin="dense"
            name="password"
            label="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={form.password}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="تبديل رؤية كلمة المرور"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          pb: 3, 
          pt: 0, 
          flexDirection: "column",
          gap: 1
        }}>
          {loading ? (
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress />
            </Box>
          ) : (
            <>
              <Button 
                type="submit" 
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #2886a9 0%, #1c6c8c 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1c6c8c 0%, #2886a9 100%)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                  }
                }}
              >
                login
              </Button>
              <Button 
                onClick={handleClose} 
                fullWidth
                variant="outlined"
                sx={{
                  py: 1.5,
                  borderRadius: "8px",
                  fontSize: "1rem",
                  borderColor: "#2886a9",
                  color: "#2886a9",
                  "&:hover": {
                    borderColor: "#1c6c8c",
                    backgroundColor: "rgba(40, 134, 169, 0.04)"
                  }
                }}
              >
                cancel
              </Button>
            </>
          )}
        </DialogActions>
      </form>

      {error && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: "8px",
              alignItems: "center"
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Box>
      )}
    </Dialog>
  );
};

export default Dialoglogin;