import { Box, Typography } from '@mui/material';

const HeroCards = () => {
  const cards = [
    { icon: '📊', label: 'Analytics' },
    { icon: '🤖', label: 'AI Assistant' }
  ];

  return (
    <Box
      sx={{
        flex: { xs: 1, lg: 1 },
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        {cards.map((card, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: '200px', md: '160px' },
              height: { xs: '200px', md: '160px' },
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <Box
              sx={{
                width: '48px',
                height: '48px',
                backgroundColor: '#4CAF50',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                {card.icon}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              {card.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HeroCards;
