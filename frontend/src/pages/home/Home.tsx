import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Grid, TextField, Button, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

const Home = () => {
  const [image, setImage] = useState<File | null>(null);
  const [tokenURI, setTokenURI] = useState('');
  const [output, setOutput] = useState('');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!image) {
      alert('Please upload an image.');
      return;
    }
    setOutput('Form Submitted with Image');
    // Process form data here
  };

  const handleMint = () => {
    // Minting logic here
  };

  return (
    <Grid container spacing={2} sx={{ width: '100%', maxHeight: '100vh', overflow: 'auto' }}>
      {/* Generate Metadata Form */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Generate Metadata</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Form Fields */}
            <TextField label="Name" variant="outlined" name="name" required />
            <TextField label="University Name" variant="outlined" name="university_name" required />
            <TextField label="Student ID" variant="outlined" name="student_id" required />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Issued Date" variant="outlined" name="issued_date" type="date" InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} required />
              <TextField label="Signer" variant="outlined" name="signer" sx={{ flex: 1 }} required />
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ flex: '1' }}>
                <label htmlFor="raised-button-file" style={{ width: '100%' }}>
                  <Button fullWidth component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload
                    <VisuallyHiddenInput accept="image/*" id="raised-button-file" type="file" name="image" onChange={handleImageChange} />
                  </Button>
                </label>
              </Box>
              <Box sx={{ flex: '1' }}>
                <Button fullWidth variant="contained" type="submit">Submit</Button>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>NFT Minter</Typography>
          <TextField label="Token URI" variant="outlined" fullWidth value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} required sx={{ mb: 2 }} />
          <Button variant="contained" onClick={handleMint} fullWidth>Mint</Button>
        </Paper>
      </Grid>

      {/* Terminal Output Section */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ minHeight: "100%", p: 2, backgroundColor: '#333', color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'lightgreen' }}>Terminal Output</Typography>
          <Box sx={{ fontFamily: 'monospace', marginTop: 2 }}>{output || 'No output yet...'}</Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;
