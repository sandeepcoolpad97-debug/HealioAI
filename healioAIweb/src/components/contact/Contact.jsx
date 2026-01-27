import { Box, Container, Grid, Card, CardContent } from '@mui/material';
import ContactHeader from './ContactHeader';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

const Contact = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#F0F5FF',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <ContactHeader />
        <Card
          sx={{
            borderRadius: { xs: '24px', md: '32px' },
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            mb: 4,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
            }}
          >
            <Grid container spacing={{ xs: 4, md: 6 }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <ContactInfo />
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <ContactForm />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Contact;
