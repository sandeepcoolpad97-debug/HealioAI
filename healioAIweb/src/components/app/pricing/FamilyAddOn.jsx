import { Box, Typography, Button, Chip, Stack } from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { Card } from '@mui/material';

const FamilyAddOn = () => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E0E0E0',
        p: { xs: 3, sm: 4 },
        mb: 6,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 3, md: 4 }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: { xs: '56px', sm: '64px' },
              height: { xs: '56px', sm: '64px' },
              borderRadius: '50%',
              bgcolor: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FamilyRestroomIcon
              sx={{
                fontSize: { xs: '32px', sm: '36px' },
                color: '#4CAF50',
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 700,
                  color: '#424242',
                }}
              >
                Family Member Add-On
              </Typography>
              <Chip
                label="PREMIUM ONLY"
                size="small"
                sx={{
                  bgcolor: '#1976D2',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: '22px',
                }}
              />
            </Stack>
            <Typography
              variant="body1"
              sx={{
                color: '#616161',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.6,
              }}
            >
              Extend your Premium benefits to loved ones. Separate profiles, same priority.
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={{ xs: 'row', sm: 'column', md: 'column' }}
          spacing={1}
          alignItems={{ xs: 'center', sm: 'flex-end', md: 'flex-end' }}
          sx={{ flexShrink: 0 }}
        >
          <Box sx={{ textAlign: { xs: 'left', sm: 'right', md: 'right' } }}>
            <Typography
              variant="h5"
              component="span"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 700,
                color: '#424242',
              }}
            >
              ₹179
            </Typography>
            <Typography
              variant="body1"
              component="span"
              sx={{
                fontSize: '1rem',
                color: '#616161',
                ml: 0.5,
              }}
            >
              /member
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: '#FF6B6B',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            Max 4 members
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#1976D2',
              color: '#1976D2',
              borderRadius: '8px',
              px: 3,
              py: 1,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#1565C0',
                bgcolor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            Add Members
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default FamilyAddOn;
