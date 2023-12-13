import { Box, Grid, Paper, Typography, TextField, Button } from '@mui/material';

const Admin = () => {
  return (
    <Box>
      <Grid container spacing={2} sx={{ width: '100%', maxHeight: '100vh' }}>

        {/* First Grid Item */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Search TokenURI</Typography>
            <TextField label="Enter Token ID" variant="outlined" fullWidth required sx={{ mb: 2 }} />
            <Button variant="contained">Search</Button>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Manage Role</Typography>
            <TextField label="Role" variant="outlined" fullWidth required sx={{ mb: 2 }} />
            <TextField label="Enter account address" variant="outlined" fullWidth required sx={{ mb: 2 }} />

            {/* Button Grid */}
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Button variant="contained" fullWidth>Grant Role</Button>
              </Grid>
              <Grid item xs={5}>
                <Button variant="contained" fullWidth>Revoke Role</Button>
              </Grid>
            </Grid>

          </Paper>
        </Grid>


        {/* Second Grid Item */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Enter a message to sign</Typography>
            <TextField label="...Metadata" multiline variant="outlined"  fullWidth required sx={{ mb: 2 }} />
            <Button variant="contained">Sign Message</Button>
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Set a signature for specific token id</Typography>
            <TextField label="Enter Token ID" variant="outlined" fullWidth required sx={{ mb: 2 }} />
            <TextField label="Enter Signature" variant="outlined" fullWidth required sx={{ mb: 2 }} />

            <Button variant="contained" >Save Signature</Button>

          </Paper>
        </Grid>

        {/* Third Grid Item: Blank for now */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Check Token owner</Typography>

            <TextField label="Enter Token ID" variant="outlined" fullWidth required sx={{ mb: 2 }} />
            <Button variant="contained">Check Owner</Button>
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Transfer to Student Wallet</Typography>
            <TextField label="Destination Address" variant="outlined" fullWidth required sx={{ mb: 2 }} />
            <TextField label="Source Address" variant="outlined" fullWidth required sx={{ mb: 2 }} />

            <Button variant="contained" >Transfer</Button>

          </Paper>
        </Grid>
      </Grid>
      <Paper
        sx={{
          height: '90pt',
          display: 'flex',
          flexDirection: 'column',
          mb: 2,
          p: 2,
          backgroundColor: 'black',
          color: 'limegreen',
          fontFamily: 'monospace',
          overflow: 'auto',
        }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Terminal</Typography>
        {/* Your output content goes here */}
      </Paper>
    </Box>
  );
}

export default Admin;
