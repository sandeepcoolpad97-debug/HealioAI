import React, { useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Switch, 
  Divider,
  Stack
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Default hours structure if none provided
const DEFAULT_HOURS = [
  { day: "Mon", openTime: "09:00", closeTime: "18:00", isClosed: false },
  { day: "Tue", openTime: "09:00", closeTime: "18:00", isClosed: false },
  { day: "Wed", openTime: "09:00", closeTime: "18:00", isClosed: false },
  { day: "Thu", openTime: "09:00", closeTime: "18:00", isClosed: false },
  { day: "Fri", openTime: "09:00", closeTime: "18:00", isClosed: false },
  { day: "Sat", openTime: "10:00", closeTime: "14:00", isClosed: false },
  { day: "Sun", openTime: "00:00", closeTime: "00:00", isClosed: true }
];

export default function OperatingHoursEditor({ value, onChange, readOnly = false }) {
  // Use provided value or fallback to default structure
  // Ensure we have all 7 days in correct order
  const hours = useMemo(() => {
    const base = value && value.length > 0 ? value : DEFAULT_HOURS;
    // Sort or map to ensure Mon-Sun order if needed, 
    // but assuming data integrity or using map based on DAYS_ORDER is safer
    return DAYS_ORDER.map(day => {
      const found = base.find(h => h.day === day);
      return found || { day, openTime: "09:00", closeTime: "18:00", isClosed: false };
    });
  }, [value]);

  // Calculate dates for current week (Mon-Sun)
  const weekDates = useMemo(() => {
    const today = dayjs();
    // 1 = Monday, 7 = Sunday
    // dayjs().day() returns 0 for Sunday, 1 for Monday... 6 for Saturday.
    // We want Monday to be the start of the week.
    const currentDay = today.day(); // 0-6
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; // If Sun(0), go back 6 days. If Mon(1), go back 0 days.
    
    const monday = today.add(diffToMonday, 'day');
    
    const dates = {};
    DAYS_ORDER.forEach((dayStr, index) => {
      dates[dayStr] = monday.add(index, 'day').format('D MMM YYYY');
    });
    return dates;
  }, []);

  const handleChange = (index, field, newValue) => {
    if (readOnly) return;
    
    const newHours = [...hours];
    const currentRow = { ...newHours[index] };

    if (field === 'isClosed') {
      currentRow.isClosed = newValue;
      // Optional: reset times or keep them as is when closed? 
      // User requirement: "If isClosed is true, disable both TimePickers."
      // We'll just update the flag.
    } else if (field === 'openTime' || field === 'closeTime') {
      // newValue is a dayjs object from TimePicker
      if (newValue && newValue.isValid()) {
        currentRow[field] = newValue.format('HH:mm');
      }
    }

    newHours[index] = currentRow;
    onChange(newHours);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Operating Hours
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Stack spacing={2}>
          {hours.map((row, index) => {
            const dateStr = weekDates[row.day];
            const isOpenTimeInvalid = !row.isClosed && row.openTime >= row.closeTime;
            
            // Convert string "HH:mm" to dayjs object for TimePicker
            // We use a dummy date for time parsing to ensure valid comparison if needed internally by picker
            const openTimeObj = dayjs(`2000-01-01T${row.openTime}`);
            const closeTimeObj = dayjs(`2000-01-01T${row.closeTime}`);

            return (
              <Grid container key={row.day} alignItems="center" spacing={2}>
                {/* Day & Date */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {row.day}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dateStr}
                  </Typography>
                </Grid>

                {/* Open Time */}
                <Grid item xs={5} sm={3}>
                  <TimePicker
                    label="Open"
                    value={openTimeObj}
                    onChange={(newValue) => handleChange(index, 'openTime', newValue)}
                    disabled={readOnly || row.isClosed}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: isOpenTimeInvalid,
                        helperText: isOpenTimeInvalid ? 'Invalid' : ''
                      }
                    }}
                    ampm={false} // 24h format as per "HH:mm" requirement usually implies 24h or just consistency
                  />
                </Grid>

                {/* Close Time */}
                <Grid item xs={5} sm={3}>
                  <TimePicker
                    label="Close"
                    value={closeTimeObj}
                    onChange={(newValue) => handleChange(index, 'closeTime', newValue)}
                    disabled={readOnly || row.isClosed}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: isOpenTimeInvalid
                      }
                    }}
                    ampm={false}
                  />
                </Grid>

                {/* Closed Switch */}
                <Grid item xs={2} sm={3} display="flex" alignItems="center" justifyContent="flex-end">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color={row.isClosed ? "error" : "text.primary"}>
                      {row.isClosed ? "Closed" : "Open"}
                    </Typography>
                    <Switch
                      checked={row.isClosed}
                      onChange={(e) => handleChange(index, 'isClosed', e.target.checked)}
                      disabled={readOnly}
                      color="error"
                    />
                  </Stack>
                </Grid>
              </Grid>
            );
          })}
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
}
