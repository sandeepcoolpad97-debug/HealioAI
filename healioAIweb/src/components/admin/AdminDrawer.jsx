import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const DRAWER_WIDTH = 240;

/**
 * Left-side permanent drawer for the admin console.
 * Not mobile responsive per requirements.
 */
const navItems = [
  { label: 'Dashboard', to: '/admin', icon: <DashboardIcon />, end: true },
  { label: 'Users', to: '/admin/users', icon: <PeopleIcon />, end: false },
  { label: 'Subscriptions', to: '/admin/subscriptions', icon: <CardMembershipIcon />, end: false },
  { label: 'Roles', to: '/admin/roles', icon: <AdminPanelSettingsIcon />, end: false },
];

export default function AdminDrawer() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: 64, // below app bar if app bar is 64px
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          px: 2,
          py: 2,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Menu
      </Typography>
      <List disablePadding>
        {navItems.map(({ label, to, icon, end }) => (
          <ListItem key={to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={to}
              end={end}
              sx={({ palette }) => ({
                mx: 1,
                borderRadius: 1,
                '&.active': {
                  bgcolor: palette.primary.main,
                  color: palette.primary.contrastText,
                  '& .MuiListItemIcon-root': { color: 'inherit' },
                },
              })}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export const ADMIN_DRAWER_WIDTH = DRAWER_WIDTH;
