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
  fetchRoles,
  fetchRoleById,
  deleteRole,
  clearSelectedRole,
  clearError,
} from '../../../store/slices/rolesSlice';
import RoleViewDialog from '../roles/RoleViewDialog';
import RoleFormDialog from '../roles/RoleFormDialog';
import RoleDeleteDialog from '../roles/RoleDeleteDialog';

export default function AdminRolesScreen() {
  const dispatch = useDispatch();
  const { list, meta, listLoading, error } = useSelector((state) => state.roles);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    dispatch(fetchRoles({ page: page + 1, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchRoleById(id));
  };
  const handleEdit = (id) => {
    setEditId(id);
    dispatch(fetchRoleById(id));
  };
  const handleDelete = (id) => setDeleteId(id);
  const handleCreate = () => setCreateOpen(true);

  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedRole());
  };
  const handleCloseEdit = () => {
    setEditId(null);
    dispatch(clearSelectedRole());
  };
  const handleCloseDelete = () => setDeleteId(null);

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteRole(deleteId));
      setDeleteId(null);
    }
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    dispatch(fetchRoles({ page: page + 1, limit: pageSize }));
  };
  const handleUpdateSuccess = () => {
    setEditId(null);
    dispatch(clearSelectedRole());
    dispatch(fetchRoles({ page: page + 1, limit: pageSize }));
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
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 120 },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 180 },
    {
      field: 'isSystemRole',
      headerName: 'System',
      width: 90,
      valueGetter: (_, row) => (row.isSystemRole ? 'Yes' : 'No'),
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      flex: 1,
      minWidth: 120,
      valueGetter: (_, row) => (row.permissions?.length ? row.permissions.join(', ') : '—'),
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
        <Typography variant="h5">Roles</Typography>
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
                No roles
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

      <RoleViewDialog open={!!viewId} onClose={handleCloseView} />
      <RoleFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={handleCreateSuccess} mode="create" />
      <RoleFormDialog open={!!editId} onClose={handleCloseEdit} onSuccess={handleUpdateSuccess} mode="edit" roleId={editId} />
      <RoleDeleteDialog
        open={!!deleteId}
        roleName={list.find((r) => r._id === deleteId)?.name}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
