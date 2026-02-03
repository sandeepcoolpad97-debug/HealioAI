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
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  fetchLabs,
  fetchLabById,
  deleteLab,
  clearSelectedLab,
  clearError,
} from '../../../store/slices/labsSlice';
import LabViewDialog from '../labs/LabViewDialog';
import LabFormDialog from '../labs/LabFormDialog';
import LabDeleteDialog from '../labs/LabDeleteDialog';

const roleName = (row) => (row.roleId && (row.roleId.name ?? row.roleId)) || '—';
const emailDisplay = (row) => (row.emailId && row.emailId.trim()) ? row.emailId : '—';

const activeStatusChip = (isActive) => {
  if (isActive === true) {
    return <Chip label="Active" color="success" variant="filled" size="small" />;
  }
  if (isActive === false) {
    return <Chip label="Inactive" color="default" variant="outlined" size="small" />;
  }
  return '—';
};

export default function AdminLabsScreen() {
  const dispatch = useDispatch();
  const { list, meta, listLoading, error } = useSelector((state) => state.labs);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    dispatch(fetchLabs({ page: page + 1, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchLabById(id));
  };
  const handleEdit = (id) => {
    setEditId(id);
    dispatch(fetchLabById(id));
  };
  const handleDelete = (id) => setDeleteId(id);
  const handleCreate = () => setCreateOpen(true);

  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedLab());
  };
  const handleCloseEdit = () => {
    setEditId(null);
    dispatch(clearSelectedLab());
  };
  const handleCloseDelete = () => setDeleteId(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteLab(deleteId));
      setDeleteId(null);
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    dispatch(fetchLabs({ page: page + 1, limit: pageSize }));
  };
  const handleUpdateSuccess = () => {
    setEditId(null);
    dispatch(clearSelectedLab());
    dispatch(fetchLabs({ page: page + 1, limit: pageSize }));
  };

  const getSlNo = (row) => {
    const idx = list.findIndex((r) => r._id === row._id);
    return idx >= 0 ? page * pageSize + idx + 1 : '';
  };

  const columns = [
    { field: 'slNo', headerName: 'Sl No', width: 70, sortable: false, valueGetter: (value, row) => getSlNo(row) },
    { field: 'labName', headerName: 'Lab name', flex: 1, minWidth: 140 },
    { field: 'registrationNumber', headerName: 'Reg. number', width: 120 },
    { field: 'emailId', headerName: 'Email', flex: 1, minWidth: 160, valueGetter: (value, row) => emailDisplay(row) },
    { field: 'contactNumber', headerName: 'Contact', width: 120 },
    { field: 'roleId', headerName: 'Role', width: 100, valueGetter: (value, row) => roleName(row) },
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
        <Typography variant="h5">Labs</Typography>
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
          sx={{
            minHeight: 400,
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                No labs
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

      <LabViewDialog open={!!viewId} onClose={handleCloseView} />
      <LabFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={handleCreateSuccess} mode="create" />
      <LabFormDialog open={!!editId} onClose={handleCloseEdit} onSuccess={handleUpdateSuccess} mode="edit" labId={editId} />
      <LabDeleteDialog open={!!deleteId} labName={list.find((l) => l._id === deleteId)?.labName} onClose={handleCloseDelete} onConfirm={handleConfirmDelete} />
    </Box>
  );
}
