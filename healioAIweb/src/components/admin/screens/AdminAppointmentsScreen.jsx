import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  Chip,
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

  const { page, pageSize } = paginationModel;

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
      field: 'appointmentId',
      headerName: 'Appointment ID',
      width: 180,
    },
    {
      field: 'currentStartAt',
      headerName: 'Date & Time',
      width: 180,
      valueGetter: (_, row) => row.currentStartAt ? new Date(row.currentStartAt).toLocaleString() : '—'
    },
    {
      field: 'bookingStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => statusChip(params.value || params.row.status)
    },
    {
      field: 'doctorId',
      headerName: 'Doctor',
      flex: 1,
      minWidth: 150,
      valueGetter: (_, row) => row.doctorId?.doctorName || row.doctorId?.name || '—'
    },
    {
      field: 'userId',
      headerName: 'Patient',
      flex: 1,
      minWidth: 150,
      valueGetter: (_, row) => row.userId?.name || '—'
    },
    {
      field: 'consultationType',
      headerName: 'Type',
      width: 100
    },
    {
      field: 'rescheduleCount',
      headerName: 'Reschedules',
      width: 120,
      type: 'number',
    },
    {
      field: 'paymentId',
      headerName: 'Payment ID',
      width: 180,
      sortable: false,
      valueGetter: (_, row) => row.paymentId?.transactionId || '—'
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ width: '100%', minHeight: 400 }}>

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

      </Box>

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
