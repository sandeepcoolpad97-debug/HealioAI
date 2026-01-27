import { Typography, Box } from '@mui/material';

/**
 * Admin dashboard – default /admin content.
 */
export default function AdminDashboardScreen() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Admin dashboard home. Add widgets and overview content here.
      </Typography>
    </Box>
  );
}
