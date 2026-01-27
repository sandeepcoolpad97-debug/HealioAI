import { Avatar, Typography, Stack } from '@mui/material';
import navbarLogo from '../../../assets/image.svg';

const FooterBrand = () => {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          src={navbarLogo}
          sx={{
            width: { xs: 32, md: 40 },
            height: { xs: 32, md: 40 },
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
          }}
          variant="rounded"
        />
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          Healio
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '0.875rem', sm: '0.95rem' },
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: 1.6,
        }}
      >
        AI-powered healthcare you can trust
      </Typography>
    </Stack>
  );
};

export default FooterBrand;
