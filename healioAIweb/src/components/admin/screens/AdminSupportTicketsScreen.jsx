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
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FlagIcon from '@mui/icons-material/Flag';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddIcon from '@mui/icons-material/Add';
import { GridToolbar } from '@mui/x-data-grid';

import {
    fetchSupportTickets,
    fetchSupportTicketById,
    deleteSupportTicket,
    clearSelectedTicket,
    clearError,
} from '../../../store/slices/supportTicketsSlice';
import SupportTicketViewDialog from '../supportTickets/SupportTicketViewDialog';
import SupportTicketFormDialog from '../supportTickets/SupportTicketFormDialog';
import SupportTicketDeleteDialog from '../supportTickets/SupportTicketDeleteDialog';
import SupportTicketActionsDialog from '../supportTickets/SupportTicketActionsDialog';

const statusChip = (status) => {
    const statusMap = {
        open: { label: 'Open', color: 'info' },
        in_progress: { label: 'In Progress', color: 'warning' },
        closed: { label: 'Closed', color: 'success' },
    };
    const config = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} variant="outlined" size="small" />;
};

const priorityChip = (priority) => {
    const priorityMap = {
        low: { label: 'Low', color: 'default' },
        medium: { label: 'Medium', color: 'info' },
        high: { label: 'High', color: 'warning' },
        urgent: { label: 'Urgent', color: 'error' },
    };
    const config = priorityMap[priority] || { label: priority, color: 'default' };
    return <Chip label={config.label} color={config.color} variant="filled" size="small" />;
};

const getRaisedByName = (row) => {
    const ref = row.raisedById && typeof row.raisedById === 'object' ? row.raisedById : null;
    if (ref) {
        return (
            ref.name ||
            ref.clinicName ||
            ref.labName ||
            ref.doctorName ||
            ref.email ||
            ref.emailId ||
            '—'
        );
    }
    return '—';
};

export default function AdminSupportTicketsScreen() {
    const dispatch = useDispatch();
    const { list: rawList, meta, listLoading, error } = useSelector((state) => state.supportTickets);
    const list = Array.isArray(rawList) ? rawList : [];
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [viewId, setViewId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [actionsDialog, setActionsDialog] = useState({ open: false, ticketId: null, tab: 0 });

    const { page, pageSize } = paginationModel;

    useEffect(() => {
        dispatch(fetchSupportTickets({ page: page + 1, limit: pageSize }));
    }, [dispatch, page, pageSize]);

    const handleView = (id) => {
        setViewId(id);
        dispatch(fetchSupportTicketById(id));
    };

    const handleDelete = (id) => setDeleteId(id);
    const handleAssign = (id) => {
        setActionsDialog({ open: true, ticketId: id, tab: 0 });
        dispatch(fetchSupportTicketById(id));
    };
    const handleStatus = (id) => {
        setActionsDialog({ open: true, ticketId: id, tab: 1 });
        dispatch(fetchSupportTicketById(id));
    };
    const handlePriority = (id) => {
        setActionsDialog({ open: true, ticketId: id, tab: 2 });
        dispatch(fetchSupportTicketById(id));
    };
    const handleCreate = () => setCreateOpen(true);

    const handleCloseView = () => {
        setViewId(null);
        dispatch(clearSelectedTicket());
    };

    const handleCloseDelete = () => setDeleteId(null);
    const handleCloseActionsDialog = () => {
        setActionsDialog({ open: false, ticketId: null, tab: 0 });
        dispatch(clearSelectedTicket());
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            dispatch(deleteSupportTicket(deleteId));
            setDeleteId(null);
        }
    };

    const handleCreateSuccess = () => {
        setCreateOpen(false);
        dispatch(fetchSupportTickets({ page: page + 1, limit: pageSize }));
    };

    const handleActionSuccess = () => {
        setActionsDialog({ open: false, ticketId: null, tab: 0 });
        dispatch(clearSelectedTicket());
        dispatch(fetchSupportTickets({ page: page + 1, limit: pageSize }));
    };

    const getSlNo = (row) => {
        const idx = list.findIndex((t) => t._id === row._id);
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
            field: 'ticketId',
            headerName: 'Ticket ID',
            width: 120,
        },
        {
            field: 'subject',
            headerName: 'Subject',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'raisedBy',
            headerName: 'Raised By',
            width: 150,
            valueGetter: (_, row) => getRaisedByName(row),
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 130,
        },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 110,
            renderCell: (params) => priorityChip(params.row.priority),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => statusChip(params.row.status),
        },
        {
            field: 'lastUpdatedAt',
            headerName: 'Last Updated',
            width: 160,
            valueGetter: (_, row) => {
                if (!row.lastUpdatedAt) return '—';
                return new Date(row.lastUpdatedAt).toLocaleString();
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 220,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                    <IconButton size="small" onClick={() => handleView(params.id)} title="View" aria-label="View">
                        <VisibilityIcon fontSize="small" />
                    </IconButton>

                    <IconButton size="small" onClick={() => handleAssign(params.id)} title="Assign" aria-label="Assign" color="primary">
                        <AssignmentIndIcon fontSize="small" />
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
                <Typography variant="h5">Support Tickets</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    Create Ticket
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
                                No support tickets
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

            <SupportTicketViewDialog open={!!viewId} onClose={handleCloseView} />
            <SupportTicketFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={handleCreateSuccess} mode="create" />

            <SupportTicketDeleteDialog open={!!deleteId} onClose={handleCloseDelete} onConfirm={handleConfirmDelete} />
            <SupportTicketActionsDialog
                open={actionsDialog.open}
                ticketId={actionsDialog.ticketId}
                initialTab={actionsDialog.tab}
                onClose={handleCloseActionsDialog}
                onSuccess={handleActionSuccess}
            />
        </Box>
    );
}
