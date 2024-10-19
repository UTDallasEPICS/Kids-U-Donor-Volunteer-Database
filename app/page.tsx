import * as React from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';

export default function Home() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          primary: {
            first: '#FFEAF1',
            second: '#FFF2D8',
            third: '#D5FFDE',
            fourth: '#ECCBFF',
            fifth: '#D093FF',
            sixth: '#FFFFFF',
            seventh: '#D8D8D8',
          },
        },
      }}
    >
      <Box
        sx={{
          width: 230,
          height: 137,
          borderRadius: 0,
          bgcolor: 'primary.first',
          position: 'absolute',    
          top: '60%',              
          left: '70%',           
          transform: 'translate(-315%, -255%)', 
        }}
      >
        {/* First Box Content */}
      </Box>
      <Box
        sx={{
          width: 230,
          height: 137,
          borderRadius: 0,
          bgcolor: 'primary.second',
          position: 'absolute',
          top: '60%',           
          left: '70%',          
          transform: 'translate(-205%, -255%)',  
        }}
      >
        {/* Second Box Content */}
        </Box>
      <Box
        sx={{
          width: 230,
          height: 137,
          borderRadius: 0,
          bgcolor: 'primary.third',
          position: 'absolute',
          top: '60%',           
          left: '70%',          
          transform: 'translate(-95%, -255%)',  
        }}
      >
        {/* third Box Content */}
        </Box>
      <Box
        sx={{
          width: 360,
          height: 137,
          borderRadius: 0,
          bgcolor: 'primary.fourth',
          position: 'absolute',
          top: '60%',           
          left: '70%',          
          transform: 'translate(10%, -255%)', 
        }}
      >
        </Box>
      <Box
        sx={{
          width: 144,
          height: 137,
          borderRadius: 0,
          bgcolor: 'primary.fifth',
          position: 'absolute',
          top: '60%',          
          left: '70%',         
          transform: 'translate(175%, -255%)',  
        }}
      >
        </Box>
      <Box
        sx={{
          width: 360,
          height: 489,
          borderRadius: 0,
          bgcolor: 'primary.sixth',
          position: 'absolute',
          top: '60%',          
          left: '70%',        
          transform: 'translate(10%, -38%)',  
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
        }}
      >
        </Box>
      <Box
        sx={{
          width: 357,
          height: 333,
          borderRadius: 0,
          bgcolor: 'primary.seventh',
          position: 'absolute',
          top: '60%',         
          left: '70%',          
          transform: 'translate(-97%, -56%)',  
        }}
      >
         </Box>
      <Box
        sx={{
          width: 357,
          height: 333,
          borderRadius: 0,
          bgcolor: 'primary.seventh',
          position: 'absolute',
          top: '60%',          
          left: '70%',          
          transform: 'translate(-203%, -56%)',  
        }}
      >
         </Box>
      <Box
        sx={{
          width: 735,
          height: 135,
          borderRadius: 0,
          bgcolor: 'primary.seventh',
          position: 'absolute',
          top: '60%',          
          left: '70%',        
          transform: 'translate(-98.5%, 120%)', 
        }}
      >
      </Box>
    </ThemeProvider>
  );
}





