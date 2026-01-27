import { Box, Typography, Avatar, Stack } from '@mui/material';

const ProcessStep = ({ stepNumber, title, description, icon: IconComponent }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        px: { xs: 1, sm: 2 },
      }}
    >
      <Avatar
        sx={{
          width: { xs: 56, sm: 64, md: 72 },
          height: { xs: 56, sm: 64, md: 72 },
          bgcolor: '#E8F5E9',
          color: '#4CAF50',
          mb: 2,
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
        }}
      >
        <IconComponent sx={{ fontSize: { xs: '28px', sm: '32px', md: '36px' } }} />
      </Avatar>
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: { xs: '0.95rem', sm: '1.1rem' },
          fontWeight: 700,
          color: '#1976D2',
          mb: 1,
        }}
      >
        {stepNumber}. {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '0.85rem', sm: '0.9rem' },
          color: '#616161',
          lineHeight: 1.6,
          maxWidth: '200px',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default ProcessStep;
