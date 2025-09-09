import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(90deg, #2f82d5ff , #65a9e0ff 60%)",
        color: "white",
        py: 2,
        mt: "auto",
        textAlign: "center",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, letterSpacing: "0.5px" }}>
        © 2025 Software Managment Company.
      </Typography>
    </Box>
  );
};

export default Footer;
