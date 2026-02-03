import { Box, Typography } from '@mui/material';

/**
 * Admin screen – placeholder for admin dashboard and related screens.
 * Replace with actual admin layout and routes as you add admin features.
 */
export default function AdminScreen() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Typography variant="h5" color="text.secondary">
        Admin
      </Typography>
    </Box>
  );
}
