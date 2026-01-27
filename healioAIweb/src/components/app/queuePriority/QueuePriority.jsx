import { Box, Container } from '@mui/material';
import QueuePriorityHeader from './QueuePriorityHeader';
import ProcessFlow from './ProcessFlow';
import QueuePlans from './QueuePlans';
import EthicsDisclaimer from './EthicsDisclaimer';

const QueuePriority = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#F0F5FF',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <QueuePriorityHeader />
        <ProcessFlow />
        <QueuePlans />
        <EthicsDisclaimer />
      </Container>
    </Box>
  );
};

export default QueuePriority;
