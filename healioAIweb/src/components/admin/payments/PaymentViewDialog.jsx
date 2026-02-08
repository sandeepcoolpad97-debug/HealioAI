import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
} from '@mui/material';

const InfoItem = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">
      {value || '—'}
    </Typography>
  </Box>
);

const statusColor = (status) => {
  const map = {
    paid: 'success',
    pending: 'warning',
    failed: 'error',
    refunded: 'default',
    refund_initiated: 'info',
    partial_refunded: 'info',
  };
  return map[status] || 'default';
};

export default function PaymentViewDialog({ open, onClose, payment }) {
  if (!payment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Payment Details
        <Chip 
          label={payment.paymentStatus} 
          color={statusColor(payment.paymentStatus)} 
          size="small" 
          sx={{ ml: 2, textTransform: 'uppercase' }} 
        />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <InfoItem label="Payment ID" value={payment._id} />
            <InfoItem label="Transaction ID" value={payment.transactionId} />
            <InfoItem label="Order ID" value={payment.orderId} />
            <InfoItem label="Created At" value={new Date(payment.createdAt).toLocaleString()} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="User" value={payment.userId?.name || payment.userId} />
            <InfoItem label="Provider" value={payment.provider} />
            <InfoItem label="Paid Via" value={payment.paidVia} />
            <InfoItem label="Currency" value={payment.currency} />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Payment Summary
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <InfoItem label="Total Payable" value={payment.paymentSummary?.totalPayable} />
          </Grid>
          <Grid item xs={6} md={3}>
            <InfoItem label="Service Fee" value={payment.paymentSummary?.serviceFee} />
          </Grid>
          <Grid item xs={6} md={3}>
            <InfoItem label="Tax (SGST+CGST)" value={(payment.paymentSummary?.sgst || 0) + (payment.paymentSummary?.cgst || 0)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <InfoItem label="Discount" value={payment.paymentSummary?.discount} />
          </Grid>

          {payment.failureReason && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" color="error" gutterBottom sx={{ mt: 1 }}>
                  Failure Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <InfoItem label="Code" value={payment.failureReason.code} />
                <InfoItem label="Message" value={payment.failureReason.message} />
              </Grid>
            </>
          )}

           <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
             <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Reference
            </Typography>
             <Box sx={{ display: 'flex', gap: 4 }}>
               <InfoItem label="Service ID" value={payment.paymentFor?.serviceId} />
               <InfoItem label="Reference ID" value={payment.paymentFor?.refId} />
             </Box>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
