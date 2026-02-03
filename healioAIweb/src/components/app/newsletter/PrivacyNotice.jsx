import { Box, Typography, Stack } from '@mui/material';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';

const PrivacyNotice = () => {
  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
      <PrivacyTipOutlinedIcon
        sx={{
          fontSize: '1.125rem',
          color: '#27AE60',
          flexShrink: 0,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.875rem',
          color: '#9CA3AF',
          textAlign: 'center',
        }}
      >
        We respect your privacy. No spam, unsubscribe anytime.
      </Typography>
    </Stack>
  );
};

export default PrivacyNotice;
