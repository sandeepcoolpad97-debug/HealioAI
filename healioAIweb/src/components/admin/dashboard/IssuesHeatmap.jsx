import React from 'react';
import { Paper, Typography, Box, Tooltip } from '@mui/material';

const IssuesHeatmap = () => {
  const times = ['6am', '10am', '12am', '5pm', '8pm'];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Dummy data representing intensity (0 to 1)
  const data = [
    [0.1, 0.2, 0.1, 0.2, 0.1, 0.1, 0.1], // 6am
    [0.3, 0.4, 0.5, 0.3, 0.5, 0.2, 0.2], // 10am
    [0.4, 0.3, 0.4, 0.5, 0.8, 0.2, 0.1], // 12am
    [0.6, 0.8, 0.6, 0.9, 1.0, 0.2, 0.4], // 5pm
    [0.2, 0.1, 0.2, 0.3, 0.2, 0.1, 0.8], // 8pm
  ];

  const getColor = (intensity) => {
    // Base blue color: #4e79ff
    // Opacity based on intensity
    return `rgba(78, 121, 255, ${intensity})`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Issues opening time
      </Typography>
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '40px repeat(7, 1fr)', gap: 1 }}>
          {/* Header Row */}
          <Box></Box> {/* Empty top-left */}
          {days.map((day, i) => (
            <Typography key={i} variant="caption" align="center" color="text.secondary">
              {day}
            </Typography>
          ))}

          {/* Data Rows */}
          {times.map((time, rowIdx) => (
            <React.Fragment key={time}>
              <Typography variant="caption" color="text.secondary" align="right" sx={{ pr: 1, alignSelf: 'center' }}>
                {time}
              </Typography>
              {days.map((_, colIdx) => (
                <Tooltip key={colIdx} title={`Intensity: ${data[rowIdx][colIdx]}`}>
                  <Box
                    sx={{
                      width: '100%',
                      paddingTop: '100%', // 1:1 Aspect Ratio
                      backgroundColor: getColor(data[rowIdx][colIdx]),
                      borderRadius: 1,
                      position: 'relative',
                    }}
                  />
                </Tooltip>
              ))}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default IssuesHeatmap;
