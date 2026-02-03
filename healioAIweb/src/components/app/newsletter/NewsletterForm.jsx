import { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          width: '100%',
        }}
      >
        <TextField
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={{
            flex: { sm: 1 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              bgcolor: '#FFFFFF',
              '& fieldset': {
                borderColor: '#D1D5DB',
              },
              '&:hover fieldset': {
                borderColor: '#9CA3AF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0A5FB4',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#9CA3AF',
            },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{
            borderRadius: '8px',
            borderColor: '#0A5FB4',
            color: '#0A5FB4',
            bgcolor: '#FFFFFF',
            px: { xs: 4, sm: 6 },
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            minWidth: { xs: '100%', sm: '140px' },
            '&:hover': {
              borderColor: '#1565C0',
              bgcolor: 'rgba(10, 95, 180, 0.04)',
            },
          }}
        >
          Subscribe
        </Button>
      </Stack>
    </Box>
  );
};

export default NewsletterForm;
