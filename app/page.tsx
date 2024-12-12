'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';



const theme = createTheme({
  palette: {
    primary: {
      main: '#FFEAF1',
    },
    secondary: {
      main: '#FFF2D8',
    },
    success: {
      main: '#D5FFDE',
    },
    info: {
      main: '#ECCBFF',
    },
    warning: {
      main: '#D093FF',
    },
    text: {
      primary: '#000000', 
    },
  },
});

 
export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      {/* Box 1: Total Volunteers */}
      <Box
        sx={{
          width: 230,
          height: 137,
          borderRadius: 0,
          bgcolor: 'primary.main',
          position: 'absolute',
          top: '60%',
          left: '70%',
          transform: 'translate(-315%, -255%)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', padding: 2, color: 'text.primary' }}>
          250
        </Typography>
        <Typography variant="subtitle1" sx={{ paddingLeft: 2, color: 'text.primary' }}>
          Total Volunteers
        </Typography>
      </Box>

      {/* Box 2: Total Donors */}
      <Box
        sx={{
          width: 230,
          height: 137,
          borderRadius: 0,
          bgcolor: 'secondary.main',
          position: 'absolute',
          top: '60%',
          left: '70%',
          transform: 'translate(-205%, -255%)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', padding: 2, color: 'text.primary' }}>
          400
        </Typography>
        <Typography variant="subtitle1" sx={{ paddingLeft: 2, color: 'text.primary' }}>
          Total Donors
        </Typography>
      </Box>

      {/* Box 3: Total Grants */}
      <Box
        sx={{
          width: 230,
          height: 137,
          borderRadius: 0,
          bgcolor: 'success.main',
          position: 'absolute',
          top: '60%',
          left: '70%',
          transform: 'translate(-95%, -255%)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', padding: 2, color: 'text.primary' }}>
          630
        </Typography>
        <Typography variant="subtitle1" sx={{ paddingLeft: 2, color: 'text.primary' }}>
          Total Grants
        </Typography>
      </Box>

      {/* Box 4: Text for Upcoming Events */}
<Box
  sx={{
    width: 260, 
    height: 137,
    bgcolor: 'info.main', 
    position: 'absolute',
    top: '60%',
    left: '70%',
    transform: 'translate(14%, -255%)',
    padding: 2, 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', 
  }}
>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 4 }}>
    Upcoming Events
  </Typography>
  <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.5 }}>
    Community/guest speaker event
  </Typography>
</Box>

{/* Box 5: Date or number of days left until event */}
<Box
  sx={{
    width: 106, 
    height: 137,
    bgcolor: 'warning.main', 
    position: 'absolute',
    top: '60%',
    left: '70%',
    transform: 'translate(275%, -255%)',
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', 
    padding: 1, 
  }}
>
    <Typography
    variant="h5"
    sx={{
      color: 'text.primary', 
      fontWeight: 'bold',
      textAlign: 'center', 
    }}
  >
    In
  </Typography>
  <Typography
    variant="h4"
    sx={{
      color: 'text.primary', 
      fontWeight: 'bold',
      textAlign: 'center', 
      marginTop: 1, 
    }}
  >
    5 Days
  </Typography>
</Box>



      {/* Box 6: Tasks */}
<Box
  sx={{
    width: 360,
    height: 489,
    borderRadius: 0,
    bgcolor: '#FFFFFF', 
    position: 'absolute',
    top: '60%',
    left: '70%',
    transform: 'translate(10%, -38%)',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto',
    padding: 2, 
  }}
>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 2 }}>
    Tasks
  </Typography>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {/* Random tasks */}
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Follow up with grant applicants.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Schedule next volunteer meeting.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Send thank-you notes to donors.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Review upcoming event logistics.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Update the donor database.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Contact local businesses for potential sponsorships.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Create a flyer for the next charity drive.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Assign roles for the upcoming volunteer event.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Add recent donor contributions to the database.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Analyze volunteer participation trends over the last quarter.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Partner with other non-profits for collaborative events.
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.primary' }}>
      - Post updates about ongoing campaigns on social media.
    </Typography>
  </Box>
</Box>


      {/* Box 7: Key Metrics */}
<Box
  sx={{
    width: 357,
    height: 333,
    bgcolor: '#FFFFFF', 
    position: 'absolute',
    top: '60%',
    left: '70%',
    transform: 'translate(-97%, -56%)',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', 
    padding: 2, 
    display: 'flex',
    flexDirection: 'column',
    gap: 2, 
  }}
>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 2 }}>
    Key Metrics
  </Typography>
  
  <Box>
    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
      Volunteer Hours Logged
    </Typography>
    <Typography variant="h5" sx={{ color: 'text.primary' }}>
      1,200 hrs
    </Typography>
  </Box>

  <Box>
    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
      Average Donation Amount
    </Typography>
    <Typography variant="h5" sx={{ color: 'text.primary' }}>
      $50
    </Typography>
  </Box>

  <Box>
    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
      Pending Grant Applications
    </Typography>
    <Typography variant="h5" sx={{ color: 'text.primary' }}>
      15
    </Typography>
  </Box>
</Box>


      {/* Box 8: Campaign Performance */}
      <Box
  sx={{
    width: 357,
    height: 333,
    bgcolor: '#FFFFFF',
    position: 'absolute',
    top: '60%',
    left: '70%',
    transform: 'translate(-203%, -56%)',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 'bold',
      color: 'text.primary',
      marginBottom: '16px',
    }}
  >
    Campaign Performance
  </Typography>

    <PieChart
      width={370}
      height={200}
      series={[
        {
          data: [
            { id: 1, value: 20, label: 'Medical' },
            { id: 2, value: 20, label: 'General' },
            { id: 3, value: 20, label: 'Education' },
            { id: 4, value: 20, label: 'Clothing' },
            { id: 5, value: 20, label: 'Holiday Event' },
          ],
        },
      ]}
      legend={{ hidden: true }} 
      />
      <Box>
      <Typography variant="body2" sx={{ color: 'text.primary', marginBottom: 1 }}>
        <Box component="span" sx={{ backgroundColor: '#00BCD4', width: 12, height: 12, display: 'inline-block', marginRight: 1 }} /> Medical
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', marginBottom: 1 }}>
        <Box component="span" sx={{ backgroundColor: '#2196F3', width: 12, height: 12, display: 'inline-block', marginRight: 1 }} /> General
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', marginBottom: 1 }}>
        <Box component="span" sx={{ backgroundColor: '#9C27B0', width: 12, height: 12, display: 'inline-block', marginRight: 1 }} /> Education
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', marginBottom: 1 }}>
        <Box component="span" sx={{ backgroundColor: '#673AB7', width: 12, height: 12, display: 'inline-block', marginRight: 1 }} /> Clothing
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', marginBottom: 1 }}>
        <Box component="span" sx={{ backgroundColor: '#3F51B5', width: 12, height: 12, display: 'inline-block', marginRight: 1 }} /> Holiday Event
      </Typography>
  </Box>
</Box>


      {/* Box 9: Fundraising Progress */}
<Box
  sx={{
    width: 735,
    height: 135,
    bgcolor: '#FFFFFF', 
    position: 'absolute',
    top: '60%',
    left: '70%',
    transform: 'translate(-98.5%, 120%)',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
    padding: 2, 
  }}
>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 2 }}>
    Fundraising Progress
  </Typography>
  <Typography variant="body1" sx={{ color: 'text.primary', marginBottom: 1 }}>
    $2,000 raised out of $5,000 goal
  </Typography>
  <LinearProgress
    variant="determinate"
    value={(2000 / 5000) * 100} 
    sx={{
      height: 12,
      borderRadius: 6,
      backgroundColor: '#E0E0E0',
      '& .MuiLinearProgress-bar': {
        backgroundColor: '#76C7C0', 
      },
    }}
  />
</Box>
</ThemeProvider>
  );
}






