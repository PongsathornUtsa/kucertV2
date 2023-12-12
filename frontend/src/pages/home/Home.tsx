import { Box, Grid, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 3 }}>
      <Grid container spacing={2} alignItems="stretch" justifyContent="center">
        {/* Text Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
              Secure Academic Achievements 
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold',color:"#045e57", mb: 4 }}>
              Forever!!
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Welcome to the future of academic credential verification.
            </Typography>
            <Typography sx={{ mb: 6 }}>
              Our platform leverages the unbreakable security of blockchain technology to mint your academic certificates as Non-Fungible Tokens (NFTs).
            </Typography>
            <Typography variant="h5" sx={{fontWeight: 'bold', mb: 6 }}>
              Pongsathorn Utsahawattanasuk 6210554784
            </Typography>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <Box
              component="img"
              sx={{width: '100%', alignSelf: 'flex-end' }}
              alt="Descriptive alt text"
              src="/vector.svg" 
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
