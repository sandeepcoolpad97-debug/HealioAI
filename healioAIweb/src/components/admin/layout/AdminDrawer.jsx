import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PaymentIcon from '@mui/icons-material/Payment';
import DiscountIcon from '@mui/icons-material/Discount';
import RateReviewIcon from '@mui/icons-material/RateReview';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: DashboardIcon },
  { label: 'Users', path: '/admin/users', icon: PeopleIcon },
  { label: 'Admins', path: '/admin/admins', icon: SupervisorAccountIcon },
  { label: 'Roles', path: '/admin/roles', icon: AdminPanelSettingsIcon },
  { label: 'Subscriptions', path: '/admin/subscriptions', icon: CardMembershipIcon },
  { label: 'Clinics', path: '/admin/clinics', icon: LocalHospitalIcon },
  { label: 'Labs', path: '/admin/labs', icon: ScienceIcon },
  { label: 'Appointments', path: '/admin/appointments', icon: EventIcon },
  { label: 'Categories', path: '/admin/categories', icon: CategoryIcon },
  { label: 'Services', path: '/admin/services', icon: MedicalServicesIcon },
  { label: 'Payments', path: '/admin/payments', icon: PaymentIcon },
  { label: 'Discounts', path: '/admin/discounts', icon: DiscountIcon },
  { label: 'Reviews', path: '/admin/reviews', icon: RateReviewIcon },
];

function NavListItem({ label, path, icon: Icon }) {
  const location = useLocation();
  const isActive = path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        component={NavLink}
        to={path}
        sx={[
          { minHeight: 48, px: 2.5 },
          isActive && {
            backgroundColor: 'action.selected',
            '&.active': { backgroundColor: 'action.selected' },
            borderRight: 3,
            borderColor: 'primary.main'
          },
        ]}
      >
        <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'inherit' }}>
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontWeight: isActive ? 'bold' : 'medium',
            color: isActive ? 'primary.main' : 'inherit'
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function AdminDrawer() {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
        {/* You can add a logo here */}
        <Typography variant="h6" fontWeight="bold" color="primary">
          HEALIO.AI
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {NAV_ITEMS.map((item) => (
          <NavListItem
            key={item.path}
            label={item.label}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </List>
    </Box>
  );
}
