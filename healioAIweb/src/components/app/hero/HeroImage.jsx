import { Box } from '@mui/material';

const HeroImage = ({ image, alt }) => {
  return (
    <Box
      sx={{
        flex: { xs: 1, lg: 1 },
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '280px', md: '400px', lg: '500px' },
          height: { xs: '280px', md: '400px', lg: '500px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Card Background */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 1
          }}
        />
        
        {/* Image */}
        <Box
          component="img"
          src={image}
          alt={alt}
          sx={{
            position: 'relative',
            width: '90%',
            height: '90%',
            objectFit: 'contain',
            zIndex: 2,
            filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.2))'
          }}
        />
      </Box>
    </Box>
  );
};

export default HeroImage;
