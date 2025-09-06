import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import { useState } from "react";

interface DialogSignupCompanyProps {
  open: boolean;
  handleClose: () => void;
}
interface CompanyForm {
  password: string; // كلمة المرور للشركة
  companyname: string; // اسم الشركة
  role: string; // الدور في النظام، هنا افتراضياً "company"
  username: string; // اسم المستخدم
  establishdate: string; // تاريخ تأسيس الشركة (YYYY-MM-DD)
  description: string; // وصف الشركة
  accountId?: string; // معرف الحساب (اختياري، يتم توليده بعد التسجيل)
}

const DialogsignupCompany: React.FC<DialogSignupCompanyProps> = ({ open, handleClose }: any) => {
  const [companyid, setcompanyid] = React.useState("");
  console.log(companyid)
  const [form, setform] = React.useState<CompanyForm>({
    password: "",
    companyname: "",
    role: "company",
    username: "",
    establishdate: "",
    description: "",
  });

  
  
  function handlechange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setform({ ...form, [e.target.name]: e.target.value });
  }
  const [error, seterror] = useState(false);
  const [load, setload] = useState(false);
  const { password, role, username } = form;

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setload(true);
    try {
      console.log(form);
      const r1 = await axios.post<{ accountId: string }>("http://localhost:5290/signup", {
        password,
        username,
        role,
      });
      const id = r1.data.accountId;
      console.log(id)

      const r2 = await axios.post("http://localhost:5243/accounts", { id, username, password });
      setcompanyid(r2.data.id);
      form.accountId = id;
      const sign = await axios.post("http://localhost:5243/companies", form);

      const company_id = sign.data.id

      await axios.put("http://localhost:5290/"+id+"/set_company_id/"+company_id, null)

      const r5 = await axios.put("http://localhost:5290/" + id + "/set_info_id/" + company_id);
      console.log(r5)
      console.log(r2);
      setload(false);

     
    } catch (err:unknown) {
      if (err.response.status === 422) {
        seterror(true);
      }

      console.log(err);
    }
     toast.success("please login now  ",{position:"top-center", autoClose:5000 })
      handleClose()
     
    
  }

  return (
    <Dialog
      
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{
          fontSize: "40px",
          textAlign: "center",
          color: "white",
          backgroundColor: "rgb(40, 134, 169)",
          borderRadius: "5PX 80PX 2PX 0PX ",
        }}
      >
        Create Company Account
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginTop: "15px" }}></DialogContentText>

        <TextField
          type="Company Name"
          value={form.companyname}
          name="companyname"
          onChange={handlechange}
          required
          autoFocus
          fullWidth
          label="companyname"
          variant="standard"
          sx={{ marginTop: "10px" }}
        />
        <TextField
          required
          margin="dense"
          id="name"
          name="username"
          label="UserName"
          type="text"
          fullWidth
          value={form.username}
          onChange={handlechange}
          variant="standard"
          sx={{ marginTop: "10px" }}
        />

        <TextField
          type="password"
          value={form.password}
          name="password"
          onChange={handlechange}
          required
          fullWidth
          label="password"
          variant="standard"
          sx={{ marginTop: "10px" }}
        />

        <TextField
          required
          margin="dense"
          id="name"
          name="establishdate"
          label="EstablishDate "
          type="date"
          fullWidth
          value={form.establishdate}
          onChange={handlechange}
          variant="standard"
          sx={{ marginTop: "10px" }}
                 InputLabelProps={{
    shrink: true, // يحرك الـ label للأعلى
  }}
        />

        <TextField
          required
          margin="dense"
          id="name"
          name="description"
          label="Description"
          value={form.description}
          fullWidth
          multiline
          onChange={handlechange}
          variant="standard"
          sx={{ marginTop: "10px" }}
        />
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "rgb(40, 134, 169)" }}>
        {" "}
        {load ? (
          <Box sx={{ width: "95%", margin: "3% 3%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
            <Button onClick={handleClose} sx={{ color: "white" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{ color: "white" }}
              onClick={handleSubmit}
            >
              SIGN UP
            </Button>
          </>
        )}
      </DialogActions>
      {error ? <Alert severity="error"> error, try again </Alert> : null}
    </Dialog>
  );
};

export default DialogsignupCompany;
