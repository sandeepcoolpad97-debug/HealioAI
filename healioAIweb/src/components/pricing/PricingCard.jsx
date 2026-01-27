import { Card, CardContent, Typography, Button, Box, Chip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const PricingCard = ({ plan }) => {
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'schedule':
        return <ScheduleIcon sx={{ fontSize: '1rem' }} />;
      case 'flash':
        return <FlashOnIcon sx={{ fontSize: '1rem' }} />;
      case 'crown':
        return <EmojiEventsIcon sx={{ fontSize: '1rem' }} />;
      default:
        return null;
    }
  };

  const getChipColor = (type) => {
    switch (type) {
      case 'schedule':
        return { bgcolor: '#F5F5F5', color: '#616161' };
      case 'flash':
        return { bgcolor: '#E8F5E9', color: '#2E7D32' };
      case 'crown':
        return { bgcolor: '#E3F2FD', color: '#1976D2' };
      default:
        return { bgcolor: '#F5F5F5', color: '#616161' };
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: plan.highlighted
          ? '0 8px 24px rgba(76, 175, 80, 0.15)'
          : '0 4px 16px rgba(0, 0, 0, 0.08)',
        border: plan.highlighted ? '2px solid #4CAF50' : '1px solid #E0E0E0',
        position: 'relative',
        overflow: 'visible',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: plan.highlighted
            ? '0 12px 32px rgba(76, 175, 80, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {plan.badge && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: -12,
            transform: 'rotate(12deg)',
            zIndex: 1,
          }}
        >
          <Chip
            label={plan.badge}
            sx={{
              bgcolor: '#4CAF50',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: '28px',
              px: 1,
            }}
          />
        </Box>
      )}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 3, sm: 4 },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#9E9E9E',
            letterSpacing: '1.5px',
            mb: 1,
            textTransform: 'uppercase',
          }}
        >
          {plan.category}
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem' },
            fontWeight: 700,
            color: '#1976D2',
            mb: 2,
          }}
        >
          {plan.name}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem' },
                fontWeight: 700,
                color: '#1976D2',
                lineHeight: 1,
              }}
            >
              {plan.price}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                color: '#616161',
                ml: 0.5,
              }}
            >
              /month
            </Typography>
          </Box>
        </Box>
        <Stack spacing={2} sx={{ mb: 3, flexGrow: 1 }}>
          {plan.features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <CheckCircleIcon
                sx={{
                  color: '#4CAF50',
                  fontSize: '1.5rem',
                  mt: feature.chip ? 0.5 : 0.25,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: feature.chip && feature.text ? 0.5 : 0 }}>
                {feature.chip ? (
                  <Chip
                    icon={getIcon(feature.chip.icon)}
                    label={feature.chip.label}
                    size="small"
                    sx={{
                      ...getChipColor(feature.chip.type),
                      fontSize: '0.75rem',
                      height: '24px',
                      alignSelf: 'flex-start',
                    }}
                  />
                ) : null}
                {feature.text && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#424242',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {feature.text}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
        {plan.notes && (
          <Typography
            variant="caption"
            sx={{
              color: '#9E9E9E',
              fontSize: '0.75rem',
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            {plan.notes}
          </Typography>
        )}
        <Button
          variant={plan.buttonVariant}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            ...(plan.buttonVariant === 'contained' && plan.highlighted
              ? {
                  bgcolor: '#4CAF50',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#45A049',
                  },
                }
              : plan.buttonVariant === 'contained'
              ? {
                  bgcolor: '#1976D2',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#1565C0',
                  },
                }
              : {
                  borderColor: '#1976D2',
                  color: '#1976D2',
                  '&:hover': {
                    borderColor: '#1565C0',
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                  },
                }),
          }}
        >
          {plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
