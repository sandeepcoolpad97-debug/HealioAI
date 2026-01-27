import { Box, Typography, Avatar, Stack } from '@mui/material';
import FAQAccordion from './FAQAccordion';

const FAQCategory = ({ icon: IconComponent, title, questions }) => {
  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            bgcolor: 'rgba(76, 175, 80, 0.1)',
            color: '#4CAF50',
          }}
        >
          <IconComponent sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 600,
            color: '#2B385E',
          }}
        >
          {title}
        </Typography>
      </Stack>
      <Box>
        {questions.map((item, index) => (
          <FAQAccordion key={index} question={item.question} answer={item.answer} />
        ))}
      </Box>
    </Box>
  );
};

export default FAQCategory;
