import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Grid, TextField, Button, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from "axios";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

const Dashboard = () => {
  const [image, setImage] = useState<File | null>(null);
  const [tokenURI, setTokenURI] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const appendOutput = (newOutput: string) => {
    setOutput(prevOutput => [...prevOutput, newOutput]);
  };


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  
    if (!image) {
      console.error("No image selected");
      appendOutput("Error: No image selected");
      return;
    }
  
    const form = new FormData();
    form.append("file", image);
  
    try {
      const resFile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        form,
        {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_API_SECRET,
          },
        }
      );
  
      const imgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
  
      const metadata = {
        name: formData.get('name') as string,
        image: imgHash,
        description: {
          universityName: formData.get('university_name') as string,
          studentId: formData.get('student_id') as string,
          issuedDate: formData.get('issued_date') as string,
          signer: formData.get('signer') as string,
        }
      };
  
      const resJSON = await axios.post(
        "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        metadata,
        {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_API_SECRET,
          },
        }
      );
  
      const tokenURI = `https://ipfs.io/ipfs/${resJSON.data.IpfsHash}`;
      console.log("Token URI:", tokenURI);
      appendOutput("Token URI: " + tokenURI);
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };
  
  

  const handleMint = () => {
    // Minting logic here
  };

  return (
    <Grid container spacing={2} sx={{ width: '100%', maxHeight: '100vh' }}>
      {/* Generate Metadata Form */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Generate Metadata</Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

      {/* NFT Mint Demo Section */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            m: 0,
            p: 2, // Added comma here
            backgroundColor: '#7A70FF',
            backgroundImage: 'linear-gradient(-370deg, #3898FF, #7A70FF)',
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', width: '100%', color: '#FFFFFF' }}>
            NFT Mint Demo
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={2}>
        <Paper
          sx={{ height: '100%', display: 'flex', m: 0, p: 2, }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Terminal</Typography>
          <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
            {output.map((line, index) => (
              <Typography key={index} sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {line}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
