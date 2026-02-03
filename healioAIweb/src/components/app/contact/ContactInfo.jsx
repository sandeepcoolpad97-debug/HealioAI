import { Box, Typography, Stack } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ContactInfoItem from './ContactInfoItem';
import PrivacyDisclaimer from './PrivacyDisclaimer';

const ContactInfo = () => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600,
          color: '#0A5FB4',
          mb: 3,
        }}
      >
        Contact Information
      </Typography>
      <Stack>
        <ContactInfoItem
          icon={MailOutlineIcon}
          label="Email"
          value="support@Healio.ai"
          isLink={true}
        />
        <ContactInfoItem
          icon={AccessTimeIcon}
          label="Support Hours"
          value="9 AM - 6 PM (Mon-Sat)"
        />
        <ContactInfoItem
          icon={LocationOnIcon}
          label="Location"
          value="India"
        />
        <ContactInfoItem
          icon={ChatBubbleOutlineIcon}
          label="Support Channels"
          value="Email & In-App Chat"
        />
      </Stack>
      <PrivacyDisclaimer />
    </Box>
  );
};

export default ContactInfo;
