import { Box, Typography } from '@mui/material';

const QueuePriorityHeader = () => {
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
        mb: 6,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
          fontWeight: 700,
          color: '#1976D2',
          textAlign: 'center',
          mb: 2,
          lineHeight: 1.2,
        }}
      >
        How Hospital Queue Priority Works
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1rem', sm: '1.125rem' },
          color: '#616161',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: 1.6,
        }}
      >
        Smarter scheduling to reduce waiting time — without compromising care.
      </Typography>
    </Box>
  );
};

export default QueuePriorityHeader;
