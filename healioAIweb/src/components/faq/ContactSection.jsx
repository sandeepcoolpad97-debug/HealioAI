import { Box, Typography, Button, Stack, Avatar } from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const ContactSection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4 },
        background: '#FFFFFF',
        borderRadius: { xs: '24px', md: '32px' },
        mx: { xs: 2, md: 4 },
        mt: 6,
      }}
    >
      <Avatar
        sx={{
          width: { xs: 64, sm: 72 },
          height: { xs: 64, sm: 72 },
          bgcolor: 'rgba(76, 175, 80, 0.1)',
          color: '#4CAF50',
          mb: 3,
        }}
      >
        <HeadsetMicIcon sx={{ fontSize: { xs: '32px', sm: '36px' } }} />
      </Avatar>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: '#2B385E',
          textAlign: 'center',
          mb: 1.5,
        }}
      >
        Still have questions?
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1rem', sm: '1.125rem' },
          color: '#6A748A',
          textAlign: 'center',
          mb: 3,
          maxWidth: '500px',
          lineHeight: 1.6,
        }}
      >
        Contact our support team for personalized assistance.
      </Typography>
      <Button
        variant="contained"
        sx={{
          bgcolor: '#4CAF50',
          color: '#FFFFFF',
          borderRadius: '8px',
          px: 4,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#45A049',
          },
        }}
      >
        Contact Support
      </Button>
    </Box>
  );
};

export default ContactSection;
