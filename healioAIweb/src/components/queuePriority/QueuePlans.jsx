import { Container, Grid } from '@mui/material';
import QueuePlanCard from './QueuePlanCard';

const QueuePlans = () => {
  const plans = [
    {
      type: 'basic',
      category: 'BASIC (FREE)',
      title: 'Standard Flow',
      headerColor: '#9E9E9E',
      titleColor: '#424242',
      features: [
        { text: 'Standard waiting time', icon: 'remove' },
        { text: 'No priority boost', icon: 'remove' },
      ],
      highlighted: false,
    },
    {
      type: 'pro',
      category: 'PRO PLAN',
      title: 'Faster Access',
      headerColor: '#4CAF50',
      titleColor: '#1976D2',
      features: [
        { text: 'Faster queue movement', icon: 'check' },
        { text: 'Reduced waiting time', icon: 'check' },
      ],
      highlighted: true,
      badge: 'POPULAR',
    },
    {
      type: 'premium',
      category: 'PREMIUM',
      title: 'Top Priority',
      headerColor: '#1976D2',
      titleColor: '#1976D2',
      features: [
        { text: 'Top priority access', icon: 'check' },
        { text: 'First-available consultation', icon: 'check' },
      ],
      highlighted: false,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 8 } }}>
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {plans.map((plan, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <QueuePlanCard plan={plan} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default QueuePlans;
