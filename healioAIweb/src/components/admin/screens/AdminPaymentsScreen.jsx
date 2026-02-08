import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  fetchPayments,
  fetchPaymentById,
  clearSelectedPayment,
} from '../../../store/slices/paymentsSlice';
import PaymentViewDialog from '../payments/PaymentViewDialog';

const statusChip = (status) => {
  const config = {
    paid: { label: 'Paid', color: 'success', variant: 'filled' },
    pending: { label: 'Pending', color: 'warning', variant: 'filled' },
    failed: { label: 'Failed', color: 'error', variant: 'filled' },
    refunded: { label: 'Refunded', color: 'default', variant: 'outlined' },
    refund_initiated: { label: 'Refund Init', color: 'info', variant: 'outlined' },
  };
  const { label, color, variant } = config[status] ?? { label: status, color: 'default', variant: 'outlined' };
  return <Chip label={label} color={color} variant={variant} size="small" />;
};

export default function AdminPaymentsScreen() {
  const dispatch = useDispatch();
  const { payments, meta, loading, error, selectedPayment } = useSelector((state) => state.payments);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewId, setViewId] = useState(null);

  const { page, pageSize } = paginationModel;

  useEffect(() => {
    dispatch(fetchPayments({ page: page + 1, limit: pageSize }));
  }, [dispatch, page, pageSize]);

  const handleView = (id) => {
    setViewId(id);
    dispatch(fetchPaymentById(id));
  };

  const handleCloseView = () => {
    setViewId(null);
    dispatch(clearSelectedPayment());
  };

  const getSlNo = (row) => {
    const idx = payments.findIndex((r) => r._id === row._id);
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
      field: 'createdAt', 
      headerName: 'Date', 
      width: 180,
      valueGetter: (_, row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'
    },
    { 
      field: 'paymentStatus', 
      headerName: 'Status', 
      width: 120, 
      renderCell: (params) => statusChip(params.row.paymentStatus) 
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 100, 
      valueGetter: (_, row) => row.paymentSummary?.totalPayable
    },
    { 
      field: 'userId', 
      headerName: 'User', 
      flex: 1,
      minWidth: 150, 
      valueGetter: (_, row) => row.userId?.name || row.userId || '—'
    },
    { 
      field: 'provider', 
      headerName: 'Provider', 
      width: 100 
    },
    { 
      field: 'transactionId', 
      headerName: 'Txn ID', 
      width: 150 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton onClick={() => handleView(params.id)} title="View" size="small">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Payments</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataGrid
        rows={payments}
        columns={columns}
        getRowId={(row) => row._id}
        rowCount={meta.total}
        loading={loading}
        pageSizeOptions={[10, 20, 50]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
      />

      <PaymentViewDialog
        open={!!viewId}
        onClose={handleCloseView}
        payment={selectedPayment}
      />
    </Box>
  );
}
