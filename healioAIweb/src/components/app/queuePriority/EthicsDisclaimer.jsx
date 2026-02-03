import { Box, Typography, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Container } from '@mui/material';

const EthicsDisclaimer = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: '12px',
          borderLeft: '4px solid #4CAF50',
          p: { xs: 3, sm: 4 },
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <InfoOutlinedIcon
            sx={{
              color: '#4CAF50',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                fontWeight: 700,
                color: '#1976D2',
                mb: 1,
              }}
            >
              Medical Ethics & Fairness
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                color: '#616161',
                lineHeight: 1.6,
              }}
            >
              Medical emergencies are always treated first, regardless of subscription plan. Queue priority applies only to non-emergency and scheduled consultations to ensure system efficiency for everyone.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default EthicsDisclaimer;
