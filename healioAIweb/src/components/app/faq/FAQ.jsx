import { Box, Container, Grid } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FAQHeader from './FAQHeader';
import FAQCategory from './FAQCategory';
import ContactSection from './ContactSection';

const FAQ = () => {
  const categories = [
    {
      icon: LocalHospitalIcon,
      title: 'Hospital Queue Priority',
      questions: [
        {
          question: 'How does queue priority work?',
          answer: 'Queue priority is assigned based on your subscription plan. Premium users get top priority, Pro users get faster access, and Basic users follow standard queue flow. Medical emergencies are always treated first regardless of subscription.',
        },
        {
          question: 'Can I upgrade my plan anytime?',
          answer: 'Yes, you can upgrade your subscription plan at any time. The new priority level will be applied immediately to your next appointment booking.',
        },
        {
          question: 'Does priority affect emergency care?',
          answer: 'No, queue priority only applies to non-emergency and scheduled consultations. Medical emergencies are always treated first, ensuring fair medical-need-based care for everyone.',
        },
        {
          question: 'How much faster is the Pro plan?',
          answer: 'Pro plan users typically experience 30-50% reduction in waiting times compared to Basic users, depending on hospital capacity and appointment type.',
        },
      ],
    },
    {
      icon: CreditCardIcon,
      title: 'Pricing & Subscriptions',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, UPI, and net banking. All payments are processed securely through encrypted channels.',
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel your subscription at any time. You will continue to have access to premium features until the end of your current billing period.',
        },
        {
          question: 'Is there a free trial?',
          answer: 'Yes, our Basic plan is completely free forever. You can also try Pro or Premium plans with a 14-day money-back guarantee if you\'re not satisfied.',
        },
        {
          question: 'Do you offer family plans?',
          answer: 'Yes, Premium plan users can add up to 4 family members for ₹179 per member per month. Each member gets their own profile with full premium benefits.',
        },
      ],
    },
    {
      icon: SmartToyIcon,
      title: 'AI & Health Data',
      questions: [
        {
          question: 'How does the AI health score work?',
          answer: 'Our AI analyzes your health history, symptoms, and medical data to generate a comprehensive health score. It helps identify potential health risks and recommends preventive measures.',
        },
        {
          question: 'Is my health data secure?',
          answer: 'Yes, we use end-to-end encryption and are HIPAA compliant. Your health data is stored securely and never shared with third parties without your explicit consent.',
        },
        {
          question: 'Can I export my health data?',
          answer: 'Yes, you can export all your health data, medical records, and AI analysis reports in standard formats (PDF, JSON) at any time from your account settings.',
        },
        {
          question: 'How accurate is the symptom analyzer?',
          answer: 'Our AI symptom analyzer uses advanced machine learning trained on millions of medical cases. While it provides valuable insights, it\'s not a replacement for professional medical diagnosis.',
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#F0F5FF',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <FAQHeader />
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 4 }}>
          {categories.map((category, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <FAQCategory
                icon={category.icon}
                title={category.title}
                questions={category.questions}
              />
            </Grid>
          ))}
        </Grid>
        <ContactSection />
      </Container>
    </Box>
  );
};

export default FAQ;
