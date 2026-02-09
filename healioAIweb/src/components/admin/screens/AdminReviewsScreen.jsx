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
    Rating,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { GridToolbar } from '@mui/x-data-grid';

import {
    fetchReviews,
    fetchReviewById,
    deleteReview,
    clearSelectedReview,
    clearError,
} from '../../../store/slices/reviewsSlice';
import ReviewViewDialog from '../reviews/ReviewViewDialog';
import ReviewFormDialog from '../reviews/ReviewFormDialog';
import ReviewDeleteDialog from '../reviews/ReviewDeleteDialog';

const getUserName = (row) => (row.userId && (row.userId.name ?? row.userId)) || '—';

const activeStatusChip = (isActive) => {
    if (isActive === true) {
        return <Chip label="Active" color="success" variant="outlined" size="small" />;
    }
    if (isActive === false) {
        return <Chip label="Inactive" color="default" variant="outlined" size="small" />;
    }
    return '—';
};

export default function AdminReviewsScreen() {
    const dispatch = useDispatch();
    const { list: rawList, meta, listLoading, error } = useSelector((state) => state.reviews);
    const list = Array.isArray(rawList) ? rawList : [];
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [viewId, setViewId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);

    const { page, pageSize } = paginationModel;

    useEffect(() => {
        dispatch(fetchReviews({ page: page + 1, limit: pageSize }));
    }, [dispatch, page, pageSize]);

    const handleView = (id) => {
        setViewId(id);
        dispatch(fetchReviewById(id));
    };
    const handleEdit = (id) => {
        setEditId(id);
        dispatch(fetchReviewById(id));
    };
    const handleDelete = (id) => setDeleteId(id);
    const handleCreate = () => setCreateOpen(true);

    const handleCloseView = () => {
        setViewId(null);
        dispatch(clearSelectedReview());
    };
    const handleCloseEdit = () => {
        setEditId(null);
        dispatch(clearSelectedReview());
    };
    const handleCloseDelete = () => setDeleteId(null);

    const handleConfirmDelete = () => {
        if (deleteId) {
            dispatch(deleteReview(deleteId));
            setDeleteId(null);
        }
    };

    const handleCreateSuccess = () => {
        setCreateOpen(false);
        dispatch(fetchReviews({ page: page + 1, limit: pageSize }));
    };
    const handleUpdateSuccess = () => {
        setEditId(null);
        dispatch(clearSelectedReview());
        dispatch(fetchReviews({ page: page + 1, limit: pageSize }));
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
            field: 'userId',
            headerName: 'User',
            flex: 1,
            minWidth: 120,
            valueGetter: (_, row) => getUserName(row),
        },
        {
            field: 'reviewFor',
            headerName: 'Review For',
            width: 100,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 140,
            renderCell: (params) => <Rating value={params.row.rating ?? 0} readOnly size="small" />,
        },
        {
            field: 'comment',
            headerName: 'Comment',
            flex: 1,
            minWidth: 180,
            valueGetter: (_, row) => row.comment?.trim() || '—',
        },
        {
            field: 'isActive',
            headerName: 'Active status',
            width: 120,
            renderCell: (params) => activeStatusChip(params.row.isActive),
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
                <Typography variant="h5">Reviews</Typography>
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
                        '& .MuiDataGrid-columnHeaders': { backgroundColor: (theme) => theme.palette.primary.main },
                        '& .MuiDataGrid-columnHeader': { backgroundColor: (theme) => theme.palette.primary.main, color: '#fff' },
                        '& .MuiDataGrid-columnHeaderTitle': { color: '#fff', fontWeight: 'bold' },
                        '& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton': { color: '#fff' },
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
                                No reviews
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

            <ReviewViewDialog open={!!viewId} onClose={handleCloseView} />
            <ReviewFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={handleCreateSuccess} mode="create" />
            <ReviewFormDialog open={!!editId} onClose={handleCloseEdit} onSuccess={handleUpdateSuccess} mode="edit" reviewId={editId} />
            <ReviewDeleteDialog open={!!deleteId} onClose={handleCloseDelete} onConfirm={handleConfirmDelete} />
        </Box>
    );
}
