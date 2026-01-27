import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import AdminDrawer from './AdminDrawer';
import AdminUserProfile from './AdminUserProfile';

const APP_BAR_HEIGHT = 64;

/**
 * Admin console layout: app bar (top) with user profile at corner, permanent drawer (left), main content (Outlet).
 * Not mobile responsive per requirements.
 */
export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: APP_BAR_HEIGHT,
        }}
      >
        <Toolbar sx={{ minHeight: APP_BAR_HEIGHT, justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Admin Healio AI
          </Typography>
          <AdminUserProfile />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, marginTop: APP_BAR_HEIGHT }}>
        <AdminDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 1,
            pt: 0,
            pb: 1,
            bgcolor: 'grey.50',
            minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            '& > *': { width: '100%', maxWidth: '100%' },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
