import { useSelector } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    CircularProgress,
    Grid,
    Chip,
} from '@mui/material';

const serviceName = (discount) => discount?.serviceId?.name ?? discount?.serviceId ?? '—';

const formatRule = (rule) => {
    if (!rule || Object.keys(rule).length === 0) return '—';
    try {
        return JSON.stringify(rule, null, 2);
    } catch {
        return '—';
    }
};

export default function DiscountViewDialog({ open, onClose }) {
    const { selectedDiscount, loading } = useSelector((state) => state.discounts);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                }}
            >
                Discount details
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : selectedDiscount ? (
                    <Box sx={{ pt: 1 }}>
                        <Grid container spacing={2}>
                            {/* Row 1: Name & Price */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Name"
                                    value={selectedDiscount.name ?? '—'}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Price (Discount Amount)"
                                    value={selectedDiscount.price ?? '—'}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {/* Row 2: Description */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Description"
                                    value={selectedDiscount.description?.trim() ? selectedDiscount.description : '—'}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {/* Row 3: Service & Active Status */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Service"
                                    value={serviceName(selectedDiscount)}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Active Status"
                                    value={selectedDiscount.isActive !== false ? 'Active' : 'Inactive'}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            {/* Row 4: Rule JSON */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Rule (JSON)"
                                    value={formatRule(selectedDiscount.rule)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{ py: 2, color: 'text.secondary' }}>No discount selected.</Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
