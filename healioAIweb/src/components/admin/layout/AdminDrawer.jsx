import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { NavLink, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PaymentIcon from '@mui/icons-material/Payment';
import { DrawerHeader, Drawer } from './adminLayout.styles';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: DashboardIcon },
  { label: 'Users', path: '/admin/users', icon: PeopleIcon },
  { label: 'Roles', path: '/admin/roles', icon: AdminPanelSettingsIcon },
  { label: 'Subscriptions', path: '/admin/subscriptions', icon: CardMembershipIcon },
  { label: 'Clinics', path: '/admin/clinics', icon: LocalHospitalIcon },
  { label: 'Labs', path: '/admin/labs', icon: ScienceIcon },
  { label: 'Appointments', path: '/admin/appointments', icon: EventIcon },
  { label: 'Categories', path: '/admin/categories', icon: CategoryIcon },
  { label: 'Services', path: '/admin/services', icon: MedicalServicesIcon },
  { label: 'Payments', path: '/admin/payments', icon: PaymentIcon },
];

function NavListItem({ label, path, icon: Icon, open }) {
  const location = useLocation();
  const isActive = path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        component={NavLink}
        to={path}
        sx={[
          { minHeight: 48, px: 2.5 },
          open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
          isActive && {
            backgroundColor: 'action.selected',
            '&.active': { backgroundColor: 'action.selected' },
          },
        ]}
      >
        <ListItemIcon
          sx={[
            { minWidth: 0, justifyContent: 'center' },
            open ? { mr: 3 } : { mr: 'auto' },
          ]}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={[open ? { opacity: 1 } : { opacity: 0 }]}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function AdminDrawer({ open, onDrawerClose }) {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={onDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <NavListItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
            open={open}
          />
        ))}
      </List>
    </Drawer>
  );
}
