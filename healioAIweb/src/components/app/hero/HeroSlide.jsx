import { Box, Container } from '@mui/material';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';
import HeroCards from './HeroCards';

const HeroSlide = ({ slide }) => {
  return (
    <Box
      sx={{
        height: '100%',
        background: slide.background,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          height: '100%',
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          py: { xs: 4, md: 6 }
        }}
      >

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'center',
            height: '100%',
            gap: { xs: 4, lg: 8 }
          }}
        >
          <HeroContent
            badge={slide.badge}
            title={slide.title}
            description={slide.description}
            primaryButton={slide.primaryButton}
            secondaryButton={slide.secondaryButton}
          />

          {slide.image && (
            <HeroImage image={slide.image} alt={`Slide ${slide.id}`} />
          )}

          {slide.id === 2 && <HeroCards />}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSlide;
