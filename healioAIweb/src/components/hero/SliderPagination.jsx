import { Box } from '@mui/material';

const SliderPagination = () => {
  return (
    <Box
      className="swiper-pagination-custom"
      sx={{
        position: 'absolute',
        bottom: { xs: 24, md: 48 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: 1,
      }}
    />
  );
};

export default SliderPagination;
