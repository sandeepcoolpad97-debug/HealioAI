import { Box, Typography, Avatar, Stack } from '@mui/material';

const ContactInfoItem = ({ icon: IconComponent, label, value, isLink = false }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
      <Avatar
        sx={{
          width: { xs: 40, sm: 48 },
          height: { xs: 40, sm: 48 },
          bgcolor: '#4CAF50',
          color: '#FFFFFF',
          flexShrink: 0,
        }}
      >
        <IconComponent sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.875rem', sm: '0.95rem' },
            color: '#2B385E',
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          component={isLink ? 'a' : 'span'}
          href={isLink ? `mailto:${value}` : undefined}
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 600,
            color: '#0A5FB4',
            textDecoration: isLink ? 'underline' : 'none',
            display: 'block',
            '&:hover': {
              textDecoration: isLink ? 'underline' : 'none',
            },
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

export default ContactInfoItem;
