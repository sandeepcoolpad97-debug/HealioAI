import { Box, Container } from '@mui/material';
import NewsletterCard from './NewsletterCard';

const Newsletter = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #D6E3F9 0%, #2F80ED 100%)',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <NewsletterCard />
      </Container>
    </Box>
  );
};

export default Newsletter;
