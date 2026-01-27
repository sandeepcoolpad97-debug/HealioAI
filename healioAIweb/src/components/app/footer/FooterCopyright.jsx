import { Box, Typography } from '@mui/material';

const FooterCopyright = () => {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          color: '#FFFFFF',
        }}
      >
        © 2026 Healio. All rights reserved.
      </Typography>
    </Box>
  );
};

export default FooterCopyright;
