import { Card, CardContent, Typography, Box, Stack, LinearProgress, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const QueuePlanCard = ({ plan }) => {
  const getIcon = () => {
    switch (plan.type) {
      case 'basic':
        return <AccessTimeIcon sx={{ fontSize: '1.5rem', color: '#9E9E9E' }} />;
      case 'pro':
        return <HelpOutlineIcon sx={{ fontSize: '1.5rem', color: '#4CAF50' }} />;
      case 'premium':
        return <EmojiEventsIcon sx={{ fontSize: '1.5rem', color: '#FFA726' }} />;
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    switch (plan.type) {
      case 'basic':
        return '#E0E0E0';
      case 'pro':
        return '#4CAF50';
      case 'premium':
        return '#1976D2';
      default:
        return '#E0E0E0';
    }
  };

  const getProgressValue = () => {
    switch (plan.type) {
      case 'basic':
        return 25;
      case 'pro':
        return 60;
      case 'premium':
        return 100;
      default:
        return 0;
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
      }}
    >
      {plan.badge && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
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
          pt: plan.badge ? { xs: 4, sm: 5 } : { xs: 3, sm: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: plan.headerColor || '#9E9E9E',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            {plan.category}
          </Typography>
          {getIcon()}
        </Box>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 700,
            color: plan.titleColor || '#424242',
            mb: 3,
          }}
        >
          {plan.title}
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
          {plan.features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {feature.icon === 'check' ? (
                <CheckCircleOutlineIcon
                  sx={{
                    color: '#4CAF50',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <RemoveCircleOutlineIcon
                  sx={{
                    color: '#9E9E9E',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: '#616161',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                {feature.text}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Box>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#9E9E9E',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              mb: 1,
              display: 'block',
            }}
          >
            QUEUE SPEED
          </Typography>
          <LinearProgress
            variant="determinate"
            value={getProgressValue()}
            sx={{
              height: 8,
              borderRadius: '4px',
              bgcolor: '#F5F5F5',
              '& .MuiLinearProgress-bar': {
                bgcolor: getProgressColor(),
                borderRadius: '4px',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default QueuePlanCard;
