import { Container, Box, Grid } from '@mui/material';
import PricingHeader from './PricingHeader';
import PricingCard from './PricingCard';
import FamilyAddOn from './FamilyAddOn';
import SecurityBadges from './SecurityBadges';

const Pricing = () => {
  const plans = [
    {
      category: 'STARTER',
      name: 'Basic',
      price: '₹0',
      features: [
        {
          chip: { label: 'Standard Queue Access', icon: 'schedule', type: 'schedule' },
          text: '',
        },
        { text: 'Symptom Analyzer' },
        { text: 'Doctor & Lab Recommendations' },
        { text: 'AI Health Score (Limited)' },
        { text: 'Health History Timeline' },
      ],
      notes: 'No hospital queue priority • Max 3 analyses/mo • Single user only',
      buttonText: 'Get Started',
      buttonVariant: 'outlined',
      highlighted: false,
    },
    {
      category: 'MOST PREFERRED',
      name: 'Pro',
      price: '₹349',
      features: [
        {
          chip: { label: 'Priority Queue Access', icon: 'flash', type: 'flash' },
          text: '',
        },
        { text: 'Everything in Basic' },
        { text: 'Unlimited AI Analysis' },
        { text: 'Full AI Health Score Access' },
        { text: 'Smart Medical Reminders' },
      ],
      notes: 'Early notifications for labs • Single user only • Priority support',
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'contained',
      highlighted: true,
      badge: 'POPULAR',
    },
    {
      category: 'ENTERPRISE',
      name: 'Premium',
      price: '₹649',
      features: [
        {
          chip: { label: 'Top Priority Access', icon: 'crown', type: 'crown' },
          text: '',
        },
        { text: 'Everything in Pro' },
        { text: 'Personalized AI Doctor Matching' },
        { text: 'Family Member Add-on Support' },
        { text: '24/7 Priority Concierge' },
      ],
      notes: 'Up to 4 family members • Dedicated account manager',
      buttonText: 'Go Premium',
      buttonVariant: 'contained',
      highlighted: false,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#F0F5FF',
        minHeight: '100vh',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <PricingHeader />
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 4 }}>
          {plans.map((plan, index) => (
            <Grid size={{ xs: 12, sm:6, md: 4 }} key={index}>
              <PricingCard plan={plan} />
            </Grid>
          ))}
        </Grid>
        <FamilyAddOn />
        <SecurityBadges />
      </Container>
    </Box>
  );
};

export default Pricing;
