import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const FAQAccordion = ({ question, answer }) => {
  return (
    <Accordion
      sx={{
        bgcolor: '#FDFEFF',
        borderRadius: '12px !important',
        boxShadow: 'none',
        border: 'none',
        mb: 2,
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: '0 0 16px 0',
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <AddIcon
            sx={{
              color: '#6A748A',
              fontSize: '1.5rem',
            }}
          />
        }
        sx={{
          px: 2,
          py: 1.5,
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(45deg)',
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem' },
            fontWeight: 600,
            color: '#0A5FB4',
            pr: 2,
          }}
        >
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          px: 2,
          pb: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.875rem', sm: '0.95rem' },
            color: '#6A748A',
            lineHeight: 1.6,
          }}
        >
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQAccordion;
