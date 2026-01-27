import { Box, Avatar, Typography } from '@mui/material';

/**
 * User profile block for the admin app bar (top-right corner).
 * Not mobile responsive per requirements.
 */
export default function AdminUserProfile() {
  // Placeholder – replace with real user from auth/context
  const displayName = 'Admin User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Typography variant="body2" sx={{ color: 'inherit' }}>
        {displayName}
      </Typography>
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
        }}
      >
        {initials}
      </Avatar>
    </Box>
  );
}
