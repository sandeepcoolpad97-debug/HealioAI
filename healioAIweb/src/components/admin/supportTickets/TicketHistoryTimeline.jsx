import { Box, Typography } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MessageIcon from '@mui/icons-material/Message';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FlagIcon from '@mui/icons-material/Flag';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';

const getActionIcon = (action) => {
    const iconMap = {
        created: <AddCircleIcon />,
        user_reply: <MessageIcon />,
        agent_reply: <MessageIcon />,
        status_changed: <SwapHorizIcon />,
        closed: <SwapHorizIcon />,
        reopened: <SwapHorizIcon />,
        priority_changed: <FlagIcon />,
        assigned: <PersonAddIcon />,
        category_changed: <EditIcon />,
    };
    return iconMap[action] || <EditIcon />;
};

const getActionColor = (action) => {
    const colorMap = {
        created: 'success',
        user_reply: 'info',
        agent_reply: 'primary',
        status_changed: 'warning',
        closed: 'success',
        reopened: 'info',
        priority_changed: 'warning',
        assigned: 'primary',
        category_changed: 'secondary',
    };
    return colorMap[action] || 'grey';
};

export default function TicketHistoryTimeline({ history }) {
    if (!history || history.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">No history available</Typography>
            </Box>
        );
    }

    return (
        <Timeline position="right" sx={{ m: 0, p: 0 }}>
            {history.map((entry, index) => {
                const actor =
                    entry.performedById && typeof entry.performedById === 'object'
                        ? entry.performedById
                        : null;

                const actorName =
                    (actor &&
                        (actor.name ||
                            actor.clinicName ||
                            actor.labName ||
                            actor.doctorName ||
                            actor.email ||
                            actor.emailId)) ||
                    null;

                return (
                    <TimelineItem key={entry._id || index}>
                        <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2, py: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                                {new Date(entry.createdAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color={getActionColor(entry.action)} sx={{ boxShadow: 2 }}>
                                {getActionIcon(entry.action)}
                            </TimelineDot>
                            {index < history.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: 1 }}>
                            <Typography variant="body2" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {entry.action.replace(/_/g, ' ').charAt(0).toUpperCase() + entry.action.replace(/_/g, ' ').slice(1)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {entry.message}
                            </Typography>
                            {(actorName || entry.performedByRole) && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                                    by {actorName || entry.performedByRole}
                                </Typography>
                            )}
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );
}
