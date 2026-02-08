import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  Chip,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  fetchAppointments,
  fetchAppointmentById,
  deleteAppointment,
  clearSelectedAppointment,
} from '../../../store/slices/appointmentsSlice';
import AppointmentViewDialog from '../appointments/AppointmentViewDialog';
import AppointmentDeleteDialog from '../appointments/AppointmentDeleteDialog';

const statusChip = (status) => {
  const config = {
    confirmed: { label: 'Confirmed', color: 'success', variant: 'filled' },
    rescheduled: { label: 'Rescheduled', color: 'warning', variant: 'filled' },
    cancelled: { label: 'Cancelled', color: 'error', variant: 'filled' },
  };
  const { label, color, variant } = config[status] ?? { label: status, color: 'default', variant: 'outlined' };
  return <Chip label={label} color={color} variant={variant} size="small" />;
};

export default function AdminAppointmentsScreen() {
  const dispatch = useDispatch();
  const { list, meta, listLoading, error, selectedAppointment } = useSelector((state) => state.appointments);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewId, setViewId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    clinicName: '',
    doctorName: '',
    patientName: '',
    consultationType: '',
    date: '',
    time: '',
    status: '',
  });

  const { page, pageSize } = paginationModel;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    dispatch(fetchAppointments({ page: page + 1, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchAppointmentById(id));
  };
  const handleDelete = (id) => setDeleteId(id);

  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedAppointment());
  };
  const handleCloseDelete = () => setDeleteId(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteAppointment(deleteId));
      setDeleteId(null);
    }
  };

  const getSlNo = (row) => {
    const idx = list.findIndex((r) => r._id === row._id);
    return idx >= 0 ? page * pageSize + idx + 1 : '';
  };

  const columns = [
    {
      field: 'slNo',
      headerName: 'Sl No',
      width: 70,
      sortable: false,
      valueGetter: (_, row) => getSlNo(row),
    },
    { 
      field: 'currentStartAt', 
      headerName: 'Date & Time', 
      width: 180,
      valueGetter: (_, row) => row.currentStartAt ? new Date(row.currentStartAt).toLocaleString() : '—'
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120, 
      renderCell: (params) => statusChip(params.row.status) 
    },
    { 
      field: 'doctorId', 
      headerName: 'Doctor', 
      flex: 1,
      minWidth: 150, 
      valueGetter: (_, row) => row.doctorId?.name || row.doctorId || '—'
    },
    { 
      field: 'userId', 
      headerName: 'Patient', 
      flex: 1,
      minWidth: 150, 
      valueGetter: (_, row) => row.userId?.name || row.userId || '—'
    },
    { 
      field: 'consultationType', 
      headerName: 'Type', 
      width: 100 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton onClick={() => handleView(params.id)} title="View" size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.id)} title="Delete" color="error" size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Appointments</Typography>
      </Box>

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          {/* Row 1: Clinic Name and Doctor Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Clinic Name"
              variant="outlined"
              size="small"
              fullWidth
              value={filters.clinicName}
              onChange={(e) => handleFilterChange('clinicName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Doctor Name"
              variant="outlined"
              size="small"
              fullWidth
              value={filters.doctorName}
              onChange={(e) => handleFilterChange('doctorName', e.target.value)}
            />
          </Grid>

          {/* Row 2: Patient Name and Consultation Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Patient Name"
              variant="outlined"
              size="small"
              fullWidth
              value={filters.patientName}
              onChange={(e) => handleFilterChange('patientName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Consultation Type</InputLabel>
              <Select
                value={filters.consultationType}
                label="Consultation Type"
                onChange={(e) => handleFilterChange('consultationType', e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="chat">Chat</MenuItem>
                <MenuItem value="physical">Physical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Row 3: Appointment Date, Time, and Status */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Time"
              type="time"
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.time}
              onChange={(e) => handleFilterChange('time', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="rescheduled">Rescheduled</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataGrid
        rows={list}
        columns={columns}
        getRowId={(row) => row._id}
        rowCount={meta.total}
        loading={listLoading}
        pageSizeOptions={[10, 20, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        disableColumnSelector
        showToolbar
        slots={{ toolbar: GridToolbar }}
        sx={{
          // Full header row background
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: (theme) => theme.palette.primary.main,
          },

          // Each header cell background + text color
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: '#fff',
          },

          // Header title
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#fff',
            fontWeight: 'bold',
          },

          // Sort + menu icons
          '& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton': {
            color: '#fff',
          },

          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
        }}
      />

      <AppointmentViewDialog
        open={!!viewId}
        onClose={handleCloseView}
        appointment={selectedAppointment}
      />
      <AppointmentDeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        appointmentId={deleteId}
      />
    </Box>
  );
}
