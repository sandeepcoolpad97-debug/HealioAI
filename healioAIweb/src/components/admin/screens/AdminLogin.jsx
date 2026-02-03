import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { auth } from '../../../config/firebase';
import { login } from '../../../store/slices/authSlice';
import { api } from '../../../api/client';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset Password State
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);
  const [resetError, setResetError] = useState(null);

  const handleOpenResetDialog = () => {
    setResetEmail(email); // Pre-fill with current email input
    setResetMessage(null);
    setResetError(null);
    setOpenResetDialog(true);
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    setResetMessage(null);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('If an account exists with this email, a password reset link has been sent.');
      setTimeout(() => {
        handleCloseResetDialog();
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/invalid-email') {
         setResetError('Invalid email address format.');
      } else {
         // Generic success message for security (prevent email enumeration)
         setResetMessage('If an account exists with this email, a password reset link has been sent.');
         setTimeout(() => {
            handleCloseResetDialog();
         }, 3000);
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase user:', userCredential.user);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // 2. Backend API Call
      const payload = {
        firebaseUid: user.uid,
        email: user.email,
        idToken,
      };

      // Backend route: /admins/login (mounted at /api/admins/login)
      const response = await api.post('/admins/login', payload);
      const adminData = response.data; // Backend returns { success: true, data: admin }

      // 3. Store Response
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('adminToken', idToken); // Use Firebase ID Token
      storage.setItem('adminUser', JSON.stringify(adminData));

      // 4. Update Redux State
      dispatch(login(adminData));

      // 5. Navigate to Dashboard
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login. Please check your credentials.';
      
      if (err.code) {
        // Firebase errors
        switch (err.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          default:
            errorMessage = err.message;
        }
      } else if (err.response) {
        // Backend errors (Axios)
        errorMessage = err.response.data?.message || 'Server error occurred.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default', // Use theme background
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your admin account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2,
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Remember me"
              />
              <Link
                component="button"
                variant="body2"
                underline="hover"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenResetDialog();
                }}
                disabled={loading}
              >
                Forgot password?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isFormValid || loading}
              sx={{ mt: 1, mb: 2, py: 1.5, fontSize: '1rem' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={openResetDialog} onClose={handleCloseResetDialog} fullWidth maxWidth="xs">
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </DialogContentText>
          {resetMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {resetMessage}
            </Alert>
          )}
          {resetError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="reset-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            disabled={resetLoading || !!resetMessage}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseResetDialog} disabled={resetLoading}>
            Cancel
          </Button>
          <Button onClick={handleResetPassword} variant="contained" disabled={resetLoading || !!resetMessage}>
            {resetLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLogin;
