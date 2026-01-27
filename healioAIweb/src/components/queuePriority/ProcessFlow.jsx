import { Box, Container, Grid } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MemoryIcon from '@mui/icons-material/Memory';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ProcessStep from './ProcessStep';

const ProcessFlow = () => {
  const steps = [
    {
      stepNumber: 1,
      title: 'Book or Visit',
      description: 'User books an appointment or visits a partnered hospital using Healio.',
      icon: CalendarMonthIcon,
    },
    {
      stepNumber: 2,
      title: 'Queue Classification',
      description: 'Healio assigns queue priority based on the user\'s subscription plan.',
      icon: MemoryIcon,
    },
    {
      stepNumber: 3,
      title: 'Priority Processing',
      description: 'Optimizing wait times dynamically.',
      icon: FlashOnIcon,
    },
    {
      stepNumber: 4,
      title: 'Consultation & Care',
      description: 'User receives consultation while hospitals maintain fair medical-need-based care.',
      icon: LocalHospitalIcon,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 8 } }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: { xs: 3, md: 2 },
          px: { xs: 2, sm: 4 },
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              flex: { xs: 'none', md: 1 },
              maxWidth: { xs: '280px', md: 'none' },
              width: { xs: '100%', md: 'auto' },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: { xs: '100%', md: '36px' },
                left: { xs: '50%', md: '100%' },
                right: { xs: 'auto', md: 'auto' },
                width: { xs: '2px', md: 'calc(100% - 72px)' },
                height: { xs: '24px', md: '2px' },
                borderLeft: { xs: '2px dashed #E0E0E0', md: 'none' },
                borderTop: { xs: 'none', md: '2px dashed #E0E0E0' },
                transform: { xs: 'translateX(-50%)', md: 'none' },
                display: index < steps.length - 1 ? 'block' : 'none',
                zIndex: 0,
              },
            }}
          >
            <ProcessStep
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ProcessFlow;
