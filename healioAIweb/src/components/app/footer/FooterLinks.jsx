import { Box, Typography, Stack, Link } from '@mui/material';

const FooterLinks = ({ title, links }) => {
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
        {title}
      </Typography>
      <Stack spacing={1.5}>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href || `#${link.id}`}
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
            {link.label}
          </Link>
        ))}
      </Stack>
    </Stack>
  );
};

export default FooterLinks;
