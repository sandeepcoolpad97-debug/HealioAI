import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  fetchSubscriptions,
  fetchSubscriptionById,
  deleteSubscription,
  clearSelectedSubscription,
  clearError,
} from '../../../store/slices/subscriptionsSlice';
import SubscriptionViewDialog from '../subscriptions/SubscriptionViewDialog';
import SubscriptionFormDialog from '../subscriptions/SubscriptionFormDialog';
import SubscriptionDeleteDialog from '../subscriptions/SubscriptionDeleteDialog';

export default function AdminSubscriptionsScreen() {
  const dispatch = useDispatch();
  const { list, meta, listLoading, error } = useSelector((state) => state.subscriptions);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    dispatch(fetchSubscriptions({ page: page + 1, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchSubscriptionById(id));
  };
  const handleEdit = (id) => {
    setEditId(id);
    dispatch(fetchSubscriptionById(id));
  };
  const handleDelete = (id) => setDeleteId(id);
  const handleCreate = () => setCreateOpen(true);

  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedSubscription());
  };
  const handleCloseEdit = () => {
    setEditId(null);
    dispatch(clearSelectedSubscription());
  };
  const handleCloseDelete = () => setDeleteId(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteSubscription(deleteId));
      setDeleteId(null);
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    dispatch(fetchSubscriptions({ page: page + 1, limit: pageSize }));
  };
  const handleUpdateSuccess = () => {
    setEditId(null);
    dispatch(clearSelectedSubscription());
    dispatch(fetchSubscriptions({ page: page + 1, limit: pageSize }));
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
    { field: 'code', headerName: 'Code', width: 100 },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      valueGetter: (value, row) => `${row.currency ?? 'INR'} ${row.price ?? 0}`,
    },
    {
      field: 'durationInDays',
      headerName: 'Duration (days)',
      width: 120,
      valueGetter: (_, row) => row.durationInDays ?? '—',
    },
    {
      field: 'isSystemPlan',
      headerName: 'System',
      width: 90,
      valueGetter: (_, row) => (row.isSystemPlan ? 'Yes' : 'No'),
    },
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
        <Typography variant="h5">Subscriptions</Typography>
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
                No subscriptions
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

      <SubscriptionViewDialog open={!!viewId} onClose={handleCloseView} />
      <SubscriptionFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={handleCreateSuccess} mode="create" />
      <SubscriptionFormDialog open={!!editId} onClose={handleCloseEdit} onSuccess={handleUpdateSuccess} mode="edit" subscriptionId={editId} />
      <SubscriptionDeleteDialog
        open={!!deleteId}
        subscriptionName={list.find((s) => s._id === deleteId)?.name}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
