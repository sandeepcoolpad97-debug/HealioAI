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
      <DialogTitle sx={{ backgroundColor: (theme) => theme.palette.primary.main, color: '#fff' }}>
        Payment Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Row 1: Basic Info */}
          <Grid item xs={12} md={6}>
            <InfoItem label="Payment ID" value={payment._id} />
            <InfoItem label="Transaction ID" value={payment.transactionId} />
            <InfoItem label="Order ID" value={payment.orderId} />
            <InfoItem label="Created At" value={new Date(payment.createdAt).toLocaleString()} />
             <InfoItem label="Updated At" value={new Date(payment.updatedAt).toLocaleString()} />
          </Grid>
          <Grid item xs={12} md={6}>
             <InfoItem label="Provider" value={payment.provider} />
            <InfoItem label="Paid Via" value={payment.paidVia} />
            <InfoItem label="Currency" value={payment.currency} />
            <InfoItem label="Is Active" value={payment.isActive ? 'Yes' : 'No'} />
          </Grid>

          {/* Row 2: User Details */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              User Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoItem label="Name" value={payment.userId?.name || payment.userId} />
          </Grid>
           <Grid item xs={12} md={4}>
            <InfoItem label="Email" value={payment.userId?.email} />
          </Grid>
          <Grid item xs={12} md={4}>
             <InfoItem 
              label="Phone" 
              value={payment.userId?.phone ? `${payment.userId.phone.countryCode} ${payment.userId.phone.number} (${payment.userId.phone.verified ? 'Verified' : 'Unverified'})` : '—'} 
            />
          </Grid>

           {/* Row 3: Service Details */}
           <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Service Details
            </Typography>
          </Grid>
           <Grid item xs={12} md={4}>
             <InfoItem label="Service Name" value={payment.paymentFor?.serviceId?.name} />
           </Grid>
           <Grid item xs={12} md={4}>
             <InfoItem label="Description" value={payment.paymentFor?.serviceId?.description} />
           </Grid>
           <Grid item xs={12} md={4}>
             <InfoItem label="Ref ID" value={payment.paymentFor?.refId} />
           </Grid>


          {/* Row 4: Payment Summary */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Payment Summary
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <InfoItem label="Service Fee" value={payment.paymentSummary?.serviceFee} />
          </Grid>
          <Grid item xs={6} md={2}>
            <InfoItem label="Discount" value={payment.paymentSummary?.discount} />
          </Grid>
          <Grid item xs={6} md={2}>
            <InfoItem label="Tax (SGST+CGST)" value={(payment.paymentSummary?.sgst || 0) + (payment.paymentSummary?.cgst || 0)} />
          </Grid>
           <Grid item xs={6} md={3}>
            <InfoItem label="Refunded Amount" value={payment.paymentSummary?.refundedAmount} />
          </Grid>
           <Grid item xs={6} md={3}>
            <InfoItem label="Total Payable" value={payment.paymentSummary?.totalPayable} />
          </Grid>

          {/* Row 5: Status History */}
           {payment.statusHistory && payment.statusHistory.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                  Status History
                </Typography>
              </Grid>
              {payment.statusHistory.map((history, index) => (
                <Grid item xs={12} key={history._id || index}>
                   <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip label={history.status} size="small" color={statusColor(history.status)} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(history.at).toLocaleString()}
                      </Typography>
                   </Box>
                </Grid>
              ))}
            </>
          )}

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

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
