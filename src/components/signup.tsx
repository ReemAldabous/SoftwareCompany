import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import p from "/images/personn.png";
import  Dialoglogin from './login'

import {

  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";

import { useState } from "react";

const Dialogsignup = ({ open, handleClose }: any) => {
    const [open1, setOpen1] = React.useState(false);
    const handleClickOpen1 = () => {
      setOpen1(true);
    };
  
    const handleClose1 = () => {
      setOpen1(false);
    };
  const nav = useNavigate();
  const [form, setform] = useState({
    password: "",
    username: "",
    fullname:"",
    role: "",
    birthdate: "",
    hiringdate:"",
    salary:0,
    companyid: "",
    confirmPassword:""
  });
  function handlechange(e: any) {
    setform({ ...form, [e.target.name]: e.target.value });
  }
  const [error, seterror] = useState("");
  const [load, setload] = useState(false);
  const { password, role, username ,birthdate,companyid,salary,hiringdate ,fullname } = form;


  async function handleSubmit(e: any) {
    e.preventDefault();
    setload(true);
      if (form.password.length<8){ seterror(" Error: (passwords must be > 8 )");setload(false);
      return; }
      if (form.password !== form.confirmPassword) {
      seterror(" Error: Please check your input (passwords must match)");
      setload(false);
      return;
    }
    try {
      console.log(form);
      const r = await axios.post("http://localhost:5290/signup ", {username,password,role,companyid});
      const id = r.data.accountId;
      console.log(r);
      const r2 = await axios.post("http://localhost:5243/accounts", { id, username, password });
      const accountid=id

      let infoId = 0
      if(form.role==='developer'){
         const r3 = await axios.post("http://localhost:5243/companies/"+form.companyid+"/developers", { fullname,salary,birthdate,hiringdate, accountid,companyid });
         infoId = r3.data.id;
      }
      else{
        
        const r4 = await axios.post("http://localhost:5243/companies/"+form.companyid+"/employees", { fullname,salary,role,birthdate,hiringdate, accountid,companyid });
        infoId = r4.data.id;
      }
      console.log(infoId)
      const r5 = await axios.put("http://localhost:5290/" + id + "/set_info_id/" + infoId);
      
      setload(false);
      handleClose()
      handleClickOpen1()
     
      console.log(form);
    } catch (err: any) {
      
        seterror("username must be unique" );
        setload(false)

      console.log(err);
    }

   
    console.log(form);
  }

  return (<>
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
          borderRadius: "0PX 80PX 0PX 0PX ",
        }}
      >
        <img src={p} alt="" style={{ position: "absolute", left: "10%" }} />{" "}
        SIGN UP
      </DialogTitle>
      <DialogContent>

             
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="username"
          label="User Name"
          type="text"
          fullWidth
          value={form.username}
          onChange={handlechange}
          variant="standard"
          sx={{ marginTop: "10px" }}
        />
             <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="fullname"
          label="Full Name"
          type="text"
          fullWidth
          value={form.fullname}
          onChange={handlechange}
          variant="standard"
          sx={{ marginTop: "10px" }}
        />

                          <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
            <TextField
              required
              fullWidth
              type="password"
              name="password"
              label="Password"
              value={form.password}
              onChange={handlechange}
              variant="standard"
            />
            <TextField
              required
              fullWidth
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={handlechange}
              variant="standard"
            />
          </Box>

        <FormControl
          variant="standard"
          sx={{ minWidth: 120 }}
          fullWidth
          required
        >
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={form.role}
            onChange={handlechange}
            label="Role"
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="employee_manager">Employee Manager</MenuItem>
            <MenuItem value="project_manager">Project Manager</MenuItem>
            <MenuItem value="developer">Developer</MenuItem>
          </Select>
        </FormControl>
                 <TextField
  autoFocus
  required
  margin="dense"
  id="name"
  name="birthdate"
  label="Birth day"
  type="date"
  fullWidth
  value={form.birthdate}
  onChange={handlechange}
  variant="standard"
  sx={{ marginTop: "10px" }}
  InputLabelProps={{
    shrink: true, // يحرك الـ label للأعلى
  }}
/>
                 <TextField
  required
  id="name"
  name="hiringdate"
  label="Hiring Date"
  type="date"
  fullWidth
  value={form.hiringdate}
  onChange={handlechange}
  variant="standard"
  sx={{ marginTop: "10px" }}
  InputLabelProps={{
    shrink: true, // هذا يحرك الـ label للأعلى ويمنع التداخل
  }}
/>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="companyid"
          label="Company Id"
          type="text"
          fullWidth
          value={form.companyid}
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
                {error && (
          <Alert severity="error" sx={{ margin: "10px" }}>
           {error}
          </Alert>
        )}
    </Dialog>
    <Dialoglogin  open={open1} handleClose={handleClose1}/></>
  );
};

export default Dialogsignup;
