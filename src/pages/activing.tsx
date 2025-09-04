import axios from 'axios';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Container,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { CheckCircle, Person, Error as ErrorIcon, Refresh } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
  },
}));

const AccountAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  marginRight: theme.spacing(2),
}));

const InactiveAccounts = () => {
  const [inactiveAccounts, setInactiveAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [cookies] = useCookies(["token", "companyId", "role"]);

  const fetchInactiveAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:5290/${cookies.companyId}/not_activated`,
        { withCredentials: true }
      );
      setInactiveAccounts(response.data);
    } catch (err) {
      setError("فشل في جلب الحسابات غير النشطة. يرجى المحاولة مرة أخرى.");
      console.error('Error fetching inactive accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const activateAccount = async (accountId, username) => {
    console.log(username,accountId)
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5290/${accountId}/activate`,
        null,
        { withCredentials: true }
      );
      setSuccessMessage(`تم تفعيل حساب ${username} بنجاح`);
      await fetchInactiveAccounts();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(`فشل في تفعيل حساب ${username}`);
      console.error('Error activating account:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveAccounts();
  }, []);

  return (
    <Container maxWidth="md">
      <StyledPaper>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" color="primary">
            <Person fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
            الحسابات غير النشطة
          </Typography>
          
          <Tooltip title="تحديث القائمة">
            <IconButton 
              onClick={fetchInactiveAccounts} 
              color="primary"
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {loading && inactiveAccounts.length === 0 && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            <ErrorIcon sx={{ mr: 1 }} />
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            <CheckCircle sx={{ mr: 1 }} />
            {successMessage}
          </Alert>
        )}

        {!loading && !error && inactiveAccounts.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              لا توجد حسابات غير نشطة حالياً
            </Typography>
          </Box>
        )}

        {!loading && inactiveAccounts.length > 0 && (
          <List sx={{ width: '100%' }}>
            {inactiveAccounts.map((account) => (
              <Box key={account.id}>
                <StyledListItem>
                  <AccountAvatar>
                    {account.username.charAt(0).toUpperCase()}
                  </AccountAvatar>
                  <ListItemText
                    primary={account.username}
                    
                  />
                  <Box>
                    <Chip 
                      label="غير مفعل" 
                      color="warning" 
                      size="small" 
                      sx={{ mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CheckCircle />}
                      onClick={() => activateAccount(account.id, account.username)}
                      disabled={loading}
                      sx={{ borderRadius: '20px' }}
                    >
                      تفعيل
                    </Button>
                  </Box>
                </StyledListItem>
                <Divider variant="inset" component="li" />
              </Box>
            ))}
          </List>
        )}
      </StyledPaper>
    </Container>
  );
};

export default InactiveAccounts;