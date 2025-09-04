import React from 'react'
import { Box, Typography } from '@mui/material';
const Footer = () => {
  return ( 
    <Box 
    component="footer" 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    height="60px" // يمكن تعديل الارتفاع حسب الحاجة
    sx={{ backgroundColor: 'rgb(73, 154, 186)' , borderTop: '1px solid rgb(126, 116, 116)', bottom:'0'  , marginTop:'218px',position:'fixed', width:'100vw' }} // لتنسيق الخلفية والحدود
  >
    <Typography variant="body2" color="white">
      © 2025 Sofware Company
    </Typography>
  </Box>)
}

export default Footer
