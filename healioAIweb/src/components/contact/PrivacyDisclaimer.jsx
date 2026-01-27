import { Box, Typography, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PrivacyDisclaimer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#E8F5E9',
        border: '1px solid #A5D6A7',
        borderRadius: '12px',
        p: 2.5,
        mt: 4,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <InfoOutlinedIcon
          sx={{
            fontSize: '1.25rem',
            color: '#4CAF50',
            mt: 0.25,
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              fontWeight: 600,
              color: '#2B385E',
              mb: 0.5,
            }}
          >
            Privacy Guaranteed
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              color: '#9E9E9E',
              lineHeight: 1.5,
            }}
          >
            Your information is safe and used only to respond to your inquiry.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default PrivacyDisclaimer;
