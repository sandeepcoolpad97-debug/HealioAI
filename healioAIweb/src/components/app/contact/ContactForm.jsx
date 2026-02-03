import { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, FormControl, InputLabel, Select, MenuItem, Link } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600,
          color: '#0A5FB4',
          mb: 3,
        }}
      >
        Contact Form
      </Typography>
      <Stack spacing={3}>
        <TextField
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          required
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <FormControl fullWidth required>
          <InputLabel id="subject-label">Subject</InputLabel>
          <Select
            name="subject"
            labelId="subject-label"
            label="Subject"
            value={formData.subject}
            onChange={handleChange}
            sx={{
              borderRadius: '8px',
            }}
          >
            <MenuItem value="general">General Inquiry</MenuItem>
            <MenuItem value="subscription">Subscription & Pricing</MenuItem>
            <MenuItem value="technical">Technical Support</MenuItem>
            <MenuItem value="billing">Billing & Payments</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="message"
          label="Message"
          placeholder="Tell us how we can help you..."
          value={formData.message}
          onChange={handleChange}
          required
          multiline
          rows={5}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: '8px',
            borderColor: '#0A5FB4',
            color: '#0A5FB4',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: '#1565C0',
              bgcolor: 'rgba(10, 95, 180, 0.04)',
            },
          }}
        >
          Send Message
        </Button>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            mt: 1,
          }}
        >
          <InfoOutlinedIcon
            sx={{
              fontSize: '1rem',
              color: '#9E9E9E',
              mt: 0.25,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.875rem',
              color: '#9E9E9E',
              lineHeight: 1.5,
            }}
          >
            We do not provide medical diagnosis via this form.
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Link
            href="#faq"
            sx={{
              fontSize: '0.95rem',
              color: '#0A5FB4',
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Check our FAQ section for quick answers
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};

export default ContactForm;
