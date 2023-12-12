import { Box, Grid, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100vh', // This sets the height to the full viewport height
        display: 'flex', // Enables flexbox
        flexDirection: 'column', // Stacks children vertically
        alignItems: 'center', // Centers children horizontally
        justifyContent: 'center', // Centers children vertically
        p: 3 // Adds padding
      }}
    >
      {/* Heading */}
      <Typography variant="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Secure Your Academic Achievements Forever
      </Typography>
      
      {/* Subtitle and Description */}
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        Welcome to the future of academic credential verification.
      </Typography>
      <Typography sx={{ textAlign: 'center' }}>
        Our platform leverages the unbreakable security of blockchain technology to mint your academic certificates as Non-Fungible Tokens (NFTs).
      </Typography>
    </Box>
  );
}

export default Home;
