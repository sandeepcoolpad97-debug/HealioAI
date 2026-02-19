import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
} from '@mui/material';

// Helper for Label-Value pair
const LabelValue = ({ label, value, fullWidth = false }) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4}>
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.95rem' }}>
        {value || '—'}
      </Typography>
    </Box>
  </Grid>
);

// Helper for Section Title
const SectionTitle = ({ title }) => (
  <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #eee', pb: 1 }}>
    {title}
  </Typography>
);

export default function AppointmentViewDialog({ open, onClose, appointment }) {
  if (!appointment) return null;

  const {
    appointmentId,
    currentStartAt,
    bookingStatus,
    consultationType,
    consultationDuration,
    doctorId,
    userId,
    paymentId,
    offersApplied,
    appointmentInfo,
    rescheduleCount
  } = appointment;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: paymentId?.currency || 'INR',
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'warning';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">Appointment Details</Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        
        {/* Basic Info */}
        <Grid container spacing={2}>
          <LabelValue label="Appointment ID" value={appointmentId} />
          <LabelValue label="Date & Time" value={new Date(currentStartAt).toLocaleString()} />
          <LabelValue label="Type" value={consultationType === 'in_person' ? 'In Person' : 'Online'} />
          <LabelValue label="Duration" value={`${consultationDuration} mins`} />
          <LabelValue label="Reschedules" value={rescheduleCount} />
        </Grid>

        {/* Doctor Details */}
        <SectionTitle title="Doctor Details" />
        <Grid container spacing={2}>
          <LabelValue label="Name" value={doctorId?.doctorName || doctorId?.name} />
          <LabelValue label="Clinic" value={doctorId?.clinicName} />
          <LabelValue label="Email" value={doctorId?.emailId} />
          <LabelValue label="Specialisation" value={doctorId?.specialisation?.join(', ')} />
        </Grid>

        {/* Patient Details */}
        <SectionTitle title="Patient Details" />
        <Grid container spacing={2}>
          <LabelValue label="Name" value={userId?.name} />
          <LabelValue label="Email" value={userId?.email} />
          <LabelValue 
            label="Phone" 
            value={userId?.phone ? `${userId.phone.countryCode} ${userId.phone.number}` : ''} 
          />
        </Grid>

        {/* Payment Details */}
        <SectionTitle title="Payment Details" />
        {paymentId ? (
          <Grid container spacing={2}>
            <LabelValue label="Transaction ID" value={paymentId.transactionId} />
            <LabelValue label="Status" value={paymentId.paymentStatus?.toUpperCase()} />
            <LabelValue label="Currency" value={paymentId.currency} />
            
            {paymentId.paymentSummary && (
              <>
                <LabelValue label="Service Fee" value={formatCurrency(paymentId.paymentSummary.serviceFee)} />
                <LabelValue label="Discount" value={formatCurrency(paymentId.paymentSummary.discount)} />
                <LabelValue label="Taxes (SGST + CGST)" value={formatCurrency((paymentId.paymentSummary.sgst || 0) + (paymentId.paymentSummary.cgst || 0))} />
                <LabelValue label="Total Payable" value={formatCurrency(paymentId.paymentSummary.totalPayable)} />
                <LabelValue label="Refunded Amount" value={formatCurrency(paymentId.paymentSummary.refundedAmount)} />
              </>
            )}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">No payment details available</Typography>
        )}

        {/* Offers Applied */}
        {offersApplied && offersApplied.length > 0 && (
          <>
            <SectionTitle title="Offers Applied" />
            <Grid container spacing={2}>
              {offersApplied.map((offer, index) => (
                <Grid item xs={12} key={offer._id || index}>
                   <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Chip label="OFFER" size="small" color="secondary" variant="outlined" />
                     <Typography variant="body2">{offer.description || offer.code || 'Offer applied'}</Typography>
                   </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Appointment History / Info */}
        <SectionTitle title="Appointment History / Info" />
        {appointmentInfo && appointmentInfo.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {appointmentInfo.map((info, index) => (
              <Paper key={info._id || index} elevation={0} variant="outlined" sx={{ p: 2, bgcolor: index === appointmentInfo.length - 1 ? '#e3f2fd' : 'background.paper', borderColor: index === appointmentInfo.length - 1 ? 'primary.main' : 'divider' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                       {info.action?.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(info.startAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <LabelValue label="Symptoms" value={info.symptoms?.join(', ')} fullWidth />
                  <LabelValue label="Notes" value={info.notes} fullWidth />
                </Grid>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No history available</Typography>
        )}

        {/* Cancellation Details (if applicable) */}
        {bookingStatus === 'cancelled' && (
          <>
             <SectionTitle title="Cancellation Info" />
             <Grid container spacing={2}>
               <LabelValue label="Cancelled At" value={appointment.cancelledAt ? new Date(appointment.cancelledAt).toLocaleString() : ''} />
               <LabelValue label="Reason/Notes" value={appointment.cancellationNotes} fullWidth />
             </Grid>
          </>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
