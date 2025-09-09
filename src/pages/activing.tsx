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
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import { CheckCircle, Person, Error as ErrorIcon, Refresh, Cancel, LockOpen } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface Account {
  id: string;
  username: string;
  role: string;
  // يمكن إضافة خصائص أخرى إذا كانت موجودة في الاستجابة
}


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

const InactiveAccounts: React.FC = () => {
  const [inactiveAccounts, setInactiveAccounts] = useState<Account[]>([]);
  const [activeAccounts, setActiveAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [cookies] = useCookies(["token", "companyId", "role"]);

  const fetchAccounts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch inactive accounts
      const inactiveResponse = await axios.get<Account[]>(
        `http://localhost:5290/${cookies.companyId}/not_activated`,
        { withCredentials: true }
      );
      setInactiveAccounts(inactiveResponse.data);
      
      // Fetch active accounts
      const activeResponse = await axios.get<Account[]>(
        `http://localhost:5290/${cookies.companyId}/activated`,
        { withCredentials: true }
      );
      setActiveAccounts(activeResponse.data);
    } catch (err) {
      setError("Failed to fetch accounts. Please try again.");
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const activateAccount = async (accountId: string, username: string): Promise<void> => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5290/${accountId}/activate`,
        null,
        { withCredentials: true }
      );
      setSuccessMessage(`Account ${username} activated successfully`);
      await fetchAccounts();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(`Failed to activate account ${username}`);
      console.error('Error activating account:', err);
    } finally {
      setLoading(false);
    }
  };

  const deactivateAccount = async (accountId: string, username: string): Promise<void> => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5290/${accountId}/deactivate`,
        null,
        { withCredentials: true }
      );
      setSuccessMessage(`Account ${username} deactivated successfully`);
      await fetchAccounts();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(`Failed to deactivate account ${username}`);
      console.error('Error deactivating account:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md">
      <StyledPaper>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" color="primary">
            <Person fontSize="large" sx={{ verticalAlign: 'middle', mr: 1 }} />
            Account Management
          </Typography>
          
          <Tooltip title="Refresh list">
            <IconButton 
              onClick={fetchAccounts} 
              color="primary"
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Inactive Accounts" />
            <Tab label="Active Accounts" />
          </Tabs>
        </Box>

        {loading && inactiveAccounts.length === 0 && activeAccounts.length === 0 && (
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

        {/* Inactive Accounts Section */}
        {activeTab === 0 && (
          <>
            {!loading && !error && inactiveAccounts.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No inactive accounts at the moment
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
                        secondary={account.role}
                      />
                      <Box>
                        <Chip 
                          label="Inactive" 
                          color="warning" 
                          size="small" 
                          sx={{ mr: 2 }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<LockOpen />}
                          onClick={() => activateAccount(account.id, account.username)}
                          disabled={loading}
                          sx={{ borderRadius: '20px' }}
                        >
                          Activate
                        </Button>
                      </Box>
                    </StyledListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                ))}
              </List>
            )}
          </>
        )}

        {/* Active Accounts Section */}
        {activeTab === 1 && (
          <>
            {!loading && !error && activeAccounts.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No active accounts at the moment
                </Typography>
              </Box>
            )}

            {!loading && activeAccounts.length > 0 && (
              <List sx={{ width: '100%' }}>
                {activeAccounts.map((account) => (
                  <Box key={account.id}>
                    <StyledListItem>
                      <AccountAvatar>
                        {account.username.charAt(0).toUpperCase()}
                      </AccountAvatar>
                      <ListItemText
                        primary={account.username}
                        secondary={account.role}
                      />
                      <Box>
                        <Chip 
                          label="Active" 
                          color="success" 
                          size="small" 
                          sx={{ mr: 2 }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => deactivateAccount(account.id, account.username)}
                          disabled={loading}
                          sx={{ borderRadius: '20px' }}
                        >
                          Deactivate
                        </Button>
                      </Box>
                    </StyledListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                ))}
              </List>
            )}
          </>
        )}
      </StyledPaper>
    </Container>
  );
};

export default InactiveAccounts;