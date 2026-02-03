import { Box, Typography, Button, Chip, Stack } from '@mui/material';

const HeroContent = ({ badge, title, description, primaryButton, secondaryButton }) => {
  return (
    <Box
      sx={{
        flex: { xs: 1, lg: 1 },
        textAlign: { xs: 'center', lg: 'left' },
        color: 'white',
        backgroundColor:'white',
        zIndex: 2,
        width: "100%",
        px: { xs: 2, sm: 4, md: 6, lg: 5 },
        py: { xs: 4, sm: 6, md: 8 },
        mx: 0,
        borderRadius: 10
      }}
    >
      {/* Badge */}
      <Chip
        label={badge}
        sx={{
          mb: 3,
          backgroundColor: '#E8F5E9',
          color: '#4CAF50',
          fontWeight: 700,
          fontSize: '14px',
          borderRadius: '9999px',
          px: 2,
          py: 0.5,
          '& .MuiChip-label': {
            px: 0
          }
        }}
      />

      {/* Title */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: 'Inter',
          fontWeight: 800,
          fontSize: { xs: '32px', md: '48px', lg: '56px' },
          lineHeight: 1.25,
          mb: 3,
          whiteSpace: 'pre-line',
          color: '#0A5FB4'
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: { xs: '16px', md: '18px' },
          lineHeight: 1.625,
          color: 'black',
          mb: 4,
          mx: { xs: 'auto', lg: 0 }
        }}
      >
        {description}
      </Typography>

      {/* Buttons */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'center', lg: 'flex-start' }
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: '30A5FB4',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '16px',
            px: 4,
            py: 1.5,
            borderRadius: '16px',
            boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#F5F5F5',
              boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          {primaryButton}
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: '0A5FB4',
            fontWeight: 700,
            fontSize: '16px',
            px: 4,
            py: 1.5,
            borderRadius: '16px',
            borderWidth: 2,
            borderColor:"0A5FB4",
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 2
            }
          }}
        >
          {secondaryButton}
        </Button>
      </Stack>
    </Box>
  );
};

export default HeroContent;
