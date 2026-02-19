import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Alert,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {
  fetchServices,
  fetchServiceById,
  deleteService,
  clearSelectedService,
} from '../../../store/slices/servicesSlice';
import ServiceViewDialog from '../services/ServiceViewDialog';
import ServiceFormDialog from '../services/ServiceFormDialog';
import ServiceDeleteDialog from '../services/ServiceDeleteDialog';

export default function AdminServicesScreen() {
  const dispatch = useDispatch();
  const { list, meta, listLoading, error, selectedService } = useSelector((state) => state.services);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  
  // Dialog states
  const [viewId, setViewId] = useState(null);
  const [editService, setEditService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    dispatch(fetchServices({ page: page + 1, limit: pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page on search
  };

  // View
  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchServiceById(id));
  };
  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedService());
  };

  // Create
  const handleCreate = () => setCreateOpen(true);
  const handleCloseCreate = (success) => {
    setCreateOpen(false);
    if (success) {
      dispatch(fetchServices({ page: page + 1, limit: pageSize, search }));
    }
  };

  // Edit
  const handleEdit = (service) => {
    setEditService(service);
    setEditOpen(true);
  };
  const handleCloseEdit = (success) => {
    setEditOpen(false);
    setEditService(null);
    if (success) {
      dispatch(fetchServices({ page: page + 1, limit: pageSize, search }));
    }
  };

  // Delete
  const handleDelete = (id) => setDeleteId(id);
  const handleCloseDelete = () => setDeleteId(null);
  const handleConfirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteService(deleteId));
      setDeleteId(null);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'code', headerName: 'Code', flex: 1, minWidth: 150 },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: 200 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value !== false ? "Active" : "Inactive"} 
          color={params.value !== false ? "success" : "default"} 
          size="small" 
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton onClick={() => handleView(params.id)} title="View" size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)} title="Edit" size="small">
            <EditIcon fontSize="small" />
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
        <Typography variant="h5">Services</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search services..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            New Service
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataGrid
        rows={list}
        columns={columns}
        getRowId={(row) => row._id || row.id}
        rowCount={meta?.total || 0}
        loading={listLoading}
        pageSizeOptions={[10, 20, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
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
        }}
      />

      {/* Dialogs */}
      <ServiceViewDialog
        open={!!viewId}
        onClose={handleCloseView}
        service={selectedService}
      />
      <ServiceFormDialog
        open={createOpen}
        onClose={handleCloseCreate}
      />
      <ServiceFormDialog
        open={editOpen}
        onClose={handleCloseEdit}
        service={editService}
      />
      <ServiceDeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
