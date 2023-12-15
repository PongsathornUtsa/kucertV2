import { Box, Grid, Typography, SxProps, Theme } from '@mui/material';
const Home = () => {

  const keyframes = `
    @keyframes typing {
      0%, 100% { width: 0ch; }
      50% { width: 9ch; } /* Adjust '9ch' to match the number of characters in "Forever!!" */
    }
  `;

  const typingAnimation: SxProps<Theme> = {
    display: 'inline-block',
    borderRight: '3px solid',
    fontFamily: 'monospace', // Ensures consistent character width
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    animation: 'typing 8s steps(9, end) infinite', // '9' should match the exact number of characters in "Forever!!"
    borderColor: 'transparent ',
  };

  return (
    // for Appbar Component"
    <Box sx={{ paddingTop: '64pt' }}> 
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
        <Grid container spacing={2} alignItems="stretch" justifyContent="center" sx={{  height: '100%'}}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                Secure Academic Achievements 
              </Typography>
              <Typography variant="h2" sx={{ ...typingAnimation, fontWeight: 'bold', color: "#045e57", mb: 4 }}>
                Forever!!
              </Typography>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Welcome to the future of academic credential verification.
              </Typography>
              <Typography sx={{ mb: 6 }}>
                Our platform leverages the unbreakable security of blockchain technology to mint your academic certificates as Non-Fungible Tokens (NFTs).
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 6 }}>
                Pongsathorn Utsahawattanasuk 6210554784
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <Box
                component="img"
                sx={{ width: '100%', alignSelf: 'flex-end' }}
                alt="Descriptive alt text"
                src="/kucert/vector.svg"
              />
            </Box>
          </Grid>
        </Grid>
    </Box>
  );
}

export default Home;
