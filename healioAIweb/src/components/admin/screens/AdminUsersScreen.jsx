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
  fetchUsers,
  fetchUserById,
  deleteUser,
  clearSelectedUser,
  clearError,
} from '../../../store/slices/usersSlice';
import UserViewDialog from '../users/UserViewDialog';
import UserFormDialog from '../users/UserFormDialog';
import UserDeleteDialog from '../users/UserDeleteDialog';

const phoneDisplay = (row) =>
  row.phone ? `${row.phone.countryCode || ''} ${row.phone.number}`.trim() : '—';
const roleName = (row) => (row.roleId && (row.roleId.name ?? row.roleId)) || '—';
const subName = (row) =>
  row.subscriptionId && (row.subscriptionId.name ?? row.subscriptionId)
    ? row.subscriptionId.name ?? row.subscriptionId
    : '—';

export default function AdminUsersScreen() {
  const dispatch = useDispatch();
  const { list, meta, listLoading, error } = useSelector((state) => state.users);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    dispatch(fetchUsers({ page: page + 1, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchUserById(id));
  };
  const handleEdit = (id) => {
    setEditId(id);
    dispatch(fetchUserById(id));
  };
  const handleDelete = (id) => setDeleteId(id);
  const handleCreate = () => setCreateOpen(true);

  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedUser());
  };
  const handleCloseEdit = () => {
    setEditId(null);
    dispatch(clearSelectedUser());
  };
  const handleCloseDelete = () => setDeleteId(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteUser(deleteId));
      setDeleteId(null);
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    dispatch(fetchUsers({ page: page + 1, limit: pageSize }));
  };
  const handleUpdateSuccess = () => {
    setEditId(null);
    dispatch(clearSelectedUser());
    dispatch(fetchUsers({ page: page + 1, limit: pageSize }));
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 140 },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 130,
      valueGetter: (_, row) => phoneDisplay(row),
    },
    {
      field: 'roleId',
      headerName: 'Role',
      flex: 1,
      minWidth: 100,
      valueGetter: (_, row) => roleName(row),
    },
    {
      field: 'subscriptionId',
      headerName: 'Subscription',
      flex: 1,
      minWidth: 120,
      valueGetter: (_, row) => subName(row),
    },
    { field: 'subscriptionStatus', headerName: 'Status', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <IconButton
            size="small"
            onClick={() => handleView(params.id)}
            title="View"
            aria-label="View"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.id)}
            title="Update"
            aria-label="Update"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.id)}
            title="Delete"
            aria-label="Delete"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Users</Typography>
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.secondary',
                }}
              >
                No users
              </Box>
            ),
            loadingOverlay: () => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            ),
          }}
        />
      </Box>

      <UserViewDialog open={!!viewId} onClose={handleCloseView} />
      <UserFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
        mode="create"
      />
      <UserFormDialog
        open={!!editId}
        onClose={handleCloseEdit}
        onSuccess={handleUpdateSuccess}
        mode="edit"
        userId={editId}
      />
      <UserDeleteDialog
        open={!!deleteId}
        userName={list.find((u) => u._id === deleteId)?.name}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
