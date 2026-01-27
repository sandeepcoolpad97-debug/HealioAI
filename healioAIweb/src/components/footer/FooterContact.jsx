import { Box, Typography, Stack, IconButton, Link } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterContact = () => {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '1rem', sm: '1.125rem' },
          fontWeight: 700,
          color: '#FFFFFF',
          mb: 1,
        }}
      >
        Contact & Social
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <EmailOutlinedIcon
            sx={{
              fontSize: '1.25rem',
              color: '#4CAF50',
              flexShrink: 0,
            }}
          />
          <Link
            href="mailto:support@Healio.ai"
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
              color: '#FFFFFF',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                opacity: 0.8,
              },
            }}
          >
            support@Healio.ai
          </Link>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LocationOnOutlinedIcon
            sx={{
              fontSize: '1.25rem',
              color: '#4CAF50',
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
              color: '#FFFFFF',
            }}
          >
            India
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
          <IconButton
            component="a"
            href="#"
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              bgcolor: '#FFFFFF',
              border: '1px solid #0A5FB4',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <LinkedInIcon
              sx={{
                fontSize: { xs: '18px', sm: '20px' },
                color: '#0A5FB4',
              }}
            />
          </IconButton>
          <IconButton
            component="a"
            href="#"
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              bgcolor: '#FFFFFF',
              border: '1px solid #0A5FB4',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <HelpOutlineIcon
              sx={{
                fontSize: { xs: '18px', sm: '20px' },
                color: '#0A5FB4',
              }}
            />
          </IconButton>
          <IconButton
            component="a"
            href="#"
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              bgcolor: '#FFFFFF',
              border: '1px solid #0A5FB4',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <InstagramIcon
              sx={{
                fontSize: { xs: '18px', sm: '20px' },
                color: '#0A5FB4',
              }}
            />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FooterContact;
