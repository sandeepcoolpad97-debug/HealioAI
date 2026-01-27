import { Box, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const SliderNavigation = () => {
  const buttonStyles = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.1)'
    },
    '&.swiper-button-disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        position: 'absolute',
        bottom: { xs: 24, md: 48 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Previous Button */}
      <Box
        className="swiper-button-prev-custom"
        sx={buttonStyles}
      >
        <ChevronLeft sx={{ color: 'white', fontSize: 24 }} />
      </Box>

      {/* Next Button */}
      <Box
        className="swiper-button-next-custom"
        sx={buttonStyles}
      >
        <ChevronRight sx={{ color: 'white', fontSize: 24 }} />
      </Box>
    </Stack>
  );
};

export default SliderNavigation;
