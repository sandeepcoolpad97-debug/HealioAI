import { Box, Typography, Stack } from '@mui/material';
import NewsletterForm from './NewsletterForm';
import PrivacyNotice from './PrivacyNotice';

const NewsletterCard = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: '#FFFFFF',
        borderRadius: { xs: '24px', md: '32px' },
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        maxWidth: '800px',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgcolor: '#27AE60',
        }}
      />
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 3, sm: 4, md: 6 },
          pt: { xs: 7, md: 9 },
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              fontWeight: 700,
              color: '#0A5FB4',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            Stay Updated with Healio
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: '#4F4F4F',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Get healthcare tips, AI insights, and product updates delivered to your inbox.
          </Typography>
          <NewsletterForm />
          <PrivacyNotice />
        </Stack>
      </Box>
    </Box>
  );
};

export default NewsletterCard;
