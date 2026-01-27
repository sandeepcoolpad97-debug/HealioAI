import { Box, Stack, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SellIcon from '@mui/icons-material/Sell';
import ReplayIcon from '@mui/icons-material/Replay';

const SecurityBadges = () => {
  const badges = [
    { icon: LockIcon, text: 'SSL SECURED' },
    { icon: LocalHospitalIcon, text: 'HIPAA COMPLIANT' },
    { icon: SellIcon, text: 'NO HIDDEN FEES' },
    { icon: ReplayIcon, text: '14-DAY REFUND' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: { xs: 3, sm: 4, md: 6 },
        py: 4,
        px: 2,
      }}
    >
      {badges.map((badge, index) => {
        const IconComponent = badge.icon;
        return (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              '&:not(:last-child)': {
                '&::after': {
                  content: '""',
                  width: '1px',
                  height: '24px',
                  bgcolor: '#E0E0E0',
                  ml: { xs: 1.5, sm: 2, md: 3 },
                  display: { xs: 'none', sm: 'block' },
                },
              },
            }}
          >
            <IconComponent
              sx={{
                fontSize: '1.25rem',
                color: '#0A5FB4',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: '#0A5FB4',
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {badge.text}
            </Typography>
          </Stack>
        );
      })}
    </Box>
  );
};

export default SecurityBadges;
