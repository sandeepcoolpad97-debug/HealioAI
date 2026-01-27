import React from 'react';
import { Box, Container, Grid, Stack } from '@mui/material';
import {
  SmartToy,
  Folder,
  People,
  VerifiedUser,
  Analytics,
  Lock,
  Shield,
  HealthAndSafety,
  Psychology,
  Favorite
} from '@mui/icons-material';
import FeaturesHeader from './FeaturesHeader';
import FeatureCard from './FeatureCard';
import ComplianceBadge from './ComplianceBadge';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <SmartToy sx={{ fontSize: { xs: 24, md: 28 }, color: '#065F46' }} />,
      title: 'AI Health Assistant',
      description: '24/7 AI assistant to answer health queries, guide symptoms, and suggest next steps with medical-grade accuracy.'
    },
    {
      id: 2,
      icon: <Folder sx={{ fontSize: { xs: 24, md: 28 }, color: '#065F46' }} />,
      title: 'Smart Health Records',
      description: 'Securely store, organize, and access medical reports anytime, anywhere. Automated categorization for easy retrieval.'
    },
    {
      id: 3,
      icon: <People sx={{ fontSize: { xs: 24, md: 28 }, color: '#065F46' }} />,
      title: 'Family Health Management',
      description: 'Manage health profiles for your entire family under one intelligent dashboard. Monitor vitals for loved ones remotely.'
    },
    {
      id: 4,
      icon: (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield sx={{ fontSize: { xs: 24, md: 28 }, color: '#065F46' }} />
          <Favorite
            sx={{
              fontSize: { xs: 10, md: 12 },
              color: '#065F46',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </Box>
      ),
      title: 'Priority Care Access',
      description: 'Faster support, privileged access, and priority healthcare assistance when it matters most. Skip the queues.'
    },
    {
      id: 5,
      icon: <Analytics sx={{ fontSize: { xs: 24, md: 28 }, color: '#065F46' }} />,
      title: 'AI Insights & Reports',
      description: 'Understand trends, risks, and deep insights from your health data using advanced AI analysis and predictive modeling.'
    },
    {
      id: 6,
      icon: <Lock sx={{ fontSize: { xs: 24, md: 28 }, color: '#065F46' }} />,
      title: 'Data Privacy & Security',
      description: 'End-to-end encrypted data with healthcare-grade privacy and compliance standards (HIPAA/GDPR ready).'
    }
  ];

  const complianceItems = [
    {
      id: 1,
      icon: <Shield sx={{ fontSize: { xs: 20, md: 24 } }} />,
      label: 'ISO 27001 Certified'
    },
    {
      id: 2,
      icon: <HealthAndSafety sx={{ fontSize: { xs: 20, md: 24 } }} />,
      label: 'HIPAA Compliant'
    },
    {
      id: 3,
      icon: <Psychology sx={{ fontSize: { xs: 20, md: 24 } }} />,
      label: 'AI Ethics Approved'
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#F0F5FF',
        minHeight: '100vh',
        py: { xs: 6, md: 8, lg: 10 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <FeaturesHeader />

        {/* Features Grid */}
        <Grid container columnSpacing={4} rowSpacing={12}  sx={{ mb: 14 }}>
        {features.map((feature) => (
            <Grid size={{ xs: 12, sm:6, md: 4 }} key={feature.id}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>


        {/* Compliance Footer Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 5, sm: 5, md: 3 }}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {complianceItems.map((item) => (
            <ComplianceBadge
              key={item.id}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Features;
