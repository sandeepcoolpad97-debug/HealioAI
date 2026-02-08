import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  fetchClinics,
  fetchClinicById,
  deleteClinic,
  clearSelectedClinic,
  clearError,
} from '../../../store/slices/clinicsSlice';
import ClinicViewDialog from '../clinics/ClinicViewDialog';
import ClinicFormDialog from '../clinics/ClinicFormDialog';
import ClinicDeleteDialog from '../clinics/ClinicDeleteDialog';

const roleName = (row) => (row.roleId && (row.roleId.name ?? row.roleId)) || '—';
const emailDisplay = (row) => (row.emailId && row.emailId.trim()) ? row.emailId : '—';

const activeStatusChip = (isActive) => {
  if (isActive === true) {
    return <Chip label="Active" color="success" variant="outlined" size="small" />;
  }
  if (isActive === false) {
    return <Chip label="Inactive" color="default" variant="outlined" size="small" />;
  }
  return '—';
};

export default function AdminClinicsScreen() {
  const dispatch = useDispatch();
  const { list, meta, listLoading, error } = useSelector((state) => state.clinics);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    dispatch(fetchClinics({ page: page + 1, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchClinicById(id));
  };
  const handleEdit = (id) => {
    setEditId(id);
    dispatch(fetchClinicById(id));
  };
  const handleDelete = (id) => setDeleteId(id);
  const handleCreate = () => setCreateOpen(true);

  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedClinic());
  };
  const handleCloseEdit = () => {
    setEditId(null);
    dispatch(clearSelectedClinic());
  };
  const handleCloseDelete = () => setDeleteId(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteClinic(deleteId));
      setDeleteId(null);
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    dispatch(fetchClinics({ page: page + 1, limit: pageSize }));
  };
  const handleUpdateSuccess = () => {
    setEditId(null);
    dispatch(clearSelectedClinic());
    dispatch(fetchClinics({ page: page + 1, limit: pageSize }));
  };

  const getSlNo = (row) => {
    const idx = list.findIndex((r) => r._id === row._id);
    return idx >= 0 ? page * pageSize + idx + 1 : '';
  };

  const columns = [
    { field: 'slNo', headerName: 'Sl No', width: 70, sortable: false, valueGetter: (_, row) => getSlNo(row) },
    { field: 'clinicName', headerName: 'Clinic name', width: 140 },
    { field: 'doctorName', headerName: 'Doctor Name', width: 140 },
    { field: 'registrationNumber', headerName: 'Reg. number', width: 150, },
    { field: 'emailId', headerName: 'Email', flex: 1, minWidth: 160, valueGetter: (_, row) => emailDisplay(row) },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      valueGetter: (_, row) => row.phone ? `${row.phone.countryCode} ${row.phone.number}` : '—'
    },
    { field: 'roleId', headerName: 'Role', width: 100, valueGetter: (_, row) => roleName(row) },
    { field: 'isActive', headerName: 'Active status', width: 120, renderCell: (params) => activeStatusChip(params.row.isActive) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton size="small" onClick={() => handleView(params.id)} title="View" aria-label="View">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleEdit(params.id)} title="Update" aria-label="Update">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.id)} title="Delete" aria-label="Delete" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Clinics</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Create
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: '100%', minHeight: 400 }}>
        <DataGrid
          rows={list}
          columns={columns}
          getRowId={(row) => row._id}
          rowCount={meta.total ?? 0}
          loading={listLoading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          disableColumnSelector
          isCellEditable={() => false}
          disableColumnMenu
          showToolbar
          sx={{
            minHeight: 400,

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
          slots={{
            toolbar: () => (
              <Box sx={{ p: 1 }}>
                <GridToolbar />
              </Box>
            ),
            noRowsOverlay: () => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                No clinics
              </Box>
            ),
            loadingOverlay: () => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ),
          }}
        />
      </Box>

      <ClinicViewDialog open={!!viewId} onClose={handleCloseView} />
      <ClinicFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={handleCreateSuccess} mode="create" />
      <ClinicFormDialog open={!!editId} onClose={handleCloseEdit} onSuccess={handleUpdateSuccess} mode="edit" clinicId={editId} />
      <ClinicDeleteDialog open={!!deleteId} clinicName={list.find((c) => c._id === deleteId)?.clinicName} onClose={handleCloseDelete} onConfirm={handleConfirmDelete} />
    </Box>
  );
}
