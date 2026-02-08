import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
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

export default function AppointmentViewDialog({ open, onClose, appointment }) {
  if (!appointment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Appointment Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <InfoItem label="ID" value={appointment._id} />
            <InfoItem label="Date & Time" value={new Date(appointment.currentStartAt).toLocaleString()} />
            <InfoItem label="Status" value={appointment.status} />
            <InfoItem label="Type" value={appointment.consultationType} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem label="Doctor" value={appointment.doctorId?.name || appointment.doctorId} />
            <InfoItem label="Patient" value={appointment.userId?.name || appointment.userId} />
            <InfoItem label="Payment ID" value={appointment.paymentId} />
            <InfoItem label="Duration" value={`${appointment.consultationDuration} mins`} />
          </Grid>
          <Grid item xs={12}>
             <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Symptoms
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {appointment.symptoms?.length > 0 ? (
                appointment.symptoms.map((s, i) => <Chip key={i} label={s} size="small" />)
              ) : (
                '—'
              )}
            </Box>
          </Grid>
          {appointment.appointmentInfo?.notes && (
             <Grid item xs={12}>
               <InfoItem label="Notes" value={appointment.appointmentInfo.notes} />
             </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
