import Header from '../components/header';
import Footer from '../components/footer';
import pic from '/images/Picsart.png';
import { ToastContainer, toast } from "react-toastify";
import React, { useState } from 'react';
import DialogsignupCompany from '../components/DialogSinnupCompany';

import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Header />

      <Box
        sx={{
          width: '100vw',
          minHeight: '90vh',
          px: { xs: 3, md: 10 },
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(135deg, #f9fbff, #ffffff)',
          borderTop: '6px solid #4BB0C8',
          borderBottom: '6px solid #E44C98',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        {/* النص - يسار في الكمبيوتر - فوق في الجوال */}
        <Box
          sx={{
            flex: 1,
            order: { xs: 1, md: 1 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          > 
          <ToastContainer />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.2rem', md: '3.2rem' },
                mb: 2,
                background: 'linear-gradient(to right, #1976d2, #E44C98)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Company Software Platform
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#3286c7ff',
                fontSize: '1.3rem',
                mb: 2,
              }}
            >
              Empowering your business with modern development and project management solutions.
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 4 }}>
             This portal provides the foundation for managing the company's project effectively. From here, you can access  dashboards for  collaborate with cross-functional teams, manage projects efficiently, And delivering it on time.
            </Typography>

            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                backgroundColor: '#E44C98',
                color: '#fff',
                px: 5,
                py: 1.5,
                borderRadius: '30px',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(228, 76, 152, 0.3)',
                '&:hover': {
                  backgroundColor: '#c33b80',
                },
              }}
            >
              Create Company Account
            </Button>
          </motion.div>
        </Box>

        {/* الصورة - يمين في الكمبيوتر - تحت النص في الجوال */}
        <Box
          sx={{
            flex: 1,
            order: { xs: 2, md: 2 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img
              src={pic}
              alt="Company illustration"
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </motion.div>
        </Box>
      </Box>

      <Footer />
      <DialogsignupCompany open={open} handleClose={handleClose} />
    </>
  );
};

export default Home;
