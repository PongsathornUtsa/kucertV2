import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Box, Grid, TextField, Button, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import axios from "axios";
import Grow from '@mui/material/Grow';

//From Smart Contract
import {
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";

import ContractInterface from "../../../../backend/abiFile.json";

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
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //--------------------------------------Wagmi------------------------------
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
  const { chain } = useNetwork()
  const [tokenURI, setTokenURI] = useState('');
  const [totalMinted, setTotalMinted] = useState(0);
  const [tokenId, setTokenId] = useState("");

  const { data: tokenCounter } = useContractRead({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: "tokenCounter",
    watch: true,
  });

  useEffect(() => {
    if (tokenCounter) {
      setTotalMinted(Number(tokenCounter));
      setTokenId(tokenCounter.toString()); // Update tokenId state when tokenCounter changes
    }
  }, [tokenCounter]);

  const { config: contractWriteConfig } = usePrepareContractWrite({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: "mint",
    args: [tokenURI],
    enabled: tokenURI.length > 0,
  });

  const { data: mintData, write } = useContractWrite(contractWriteConfig);

  const { isSuccess: txSuccess } = useWaitForTransaction({ hash: mintData?.hash });

  const [etherscanUrl, setEtherscanUrl] = useState("");
  const [openSeaUrl, setOpenSeaUrl] = useState("");

  useEffect(() => {
    const displayEtherscanLink = () => {
      if (txSuccess && chain) {
        let etherscanBaseUrl = "";
        let openSeaBaseUrl = "";

        switch (chain.id) {
          case 1: // Mainnet
            etherscanBaseUrl = `https://etherscan.io/tx/${mintData?.hash}`;
            openSeaBaseUrl = `https://opensea.io/assets/${process.env.CONTRACT_ADDRESS}/${tokenId}`;
            break;
          case 5: // Goerli
            etherscanBaseUrl = `https://goerli.etherscan.io/tx/${mintData?.hash}`;
            openSeaBaseUrl = `https://testnets.opensea.io/assets/${process.env.CONTRACT_ADDRESS}/${tokenId}`;
            break;
          case 11155111: // Sepolia
            etherscanBaseUrl = `https://sepolia.etherscan.io/tx/${mintData?.hash}`;
            openSeaBaseUrl = "OpenSea link not available";
            break;
          default:
            etherscanBaseUrl = "Etherscan link not available";
            openSeaBaseUrl = "OpenSea link not available";
        }

        setEtherscanUrl(etherscanBaseUrl);
        setOpenSeaUrl(openSeaBaseUrl);
      }
    };

    displayEtherscanLink();
  }, [txSuccess, mintData, chain, tokenId]);

  const handleMint = () => {
    setIsLoading(true);
    write?.();
  };

  useEffect(() => {
    if (txSuccess) {
      setIsLoading(false);
      // Additional actions to take after successful minting
    }
  }, [txSuccess]);


  //--------------------------------------IPFS and Pinata------------------------------
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
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems="stretch">
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
                  <Button fullWidth variant="contained" type="submit" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>NFT Minter</Typography>
            <TextField
              label="Token URI"
              variant="outlined"
              fullWidth
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleMint}
              fullWidth
              disabled={!tokenURI || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Mint NFT"}
            </Button>
          </Paper>
        </Grid>

        {/* NFT Mint Demo Section */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              height: '350pt',
              display: 'flex',
              flexDirection: 'column', // Changed to column for vertical stacking
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              p: 2,
              backgroundColor: '#7A70FF',
              backgroundImage: 'linear-gradient(-370deg, #3898FF, #7A70FF)',
              borderRadius: '15pt'
            }}
          >
            <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#FFFFFF', mb: 2 }}>
              NFT Mint Demo
            </Typography>
            {txSuccess && (
              <>
                <Grow in={txSuccess} style={{ transformOrigin: '0 0 0' }} timeout={500}>
                  <Typography variant="h6" sx={{ textAlign: 'center', color: '#FFFFFF', mb: 5 }}>
                    Mint Successful!
                  </Typography>
                </Grow>
                <Grow in={txSuccess} style={{ transformOrigin: '0 0 0' }} timeout={700}>
                  <Button variant="contained" href={etherscanUrl} target="_blank" rel="noopener noreferrer" sx={{ mb: 1, bgcolor: 'lightblue', ':hover': { bgcolor: 'blue' } }}>
                    Etherscan
                  </Button>
                </Grow>
                <Grow in={txSuccess} style={{ transformOrigin: '0 0 0' }} timeout={900}>
                  {openSeaUrl !== "OpenSea link not available" ? (
                    <Button variant="contained" href={openSeaUrl} target="_blank" rel="noopener noreferrer" sx={{ mb: 1, bgcolor: 'lightblue', ':hover': { bgcolor: 'blue' } }}>
                      OpenSea
                    </Button>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#FFFFFF', mb: 5 }}>
                      OpenSea link not available
                    </Typography>
                  )}
                </Grow>
                <Grow in={txSuccess} style={{ transformOrigin: '0 0 0' }} timeout={1100}>
                  <Typography variant="body1" sx={{ textAlign: 'center', color: '#FFFFFF' }}>
                    Total Minted: {totalMinted}
                  </Typography>
                </Grow>
              </>
            )}

          </Paper>

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
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Terminal</Typography>
            <Box sx={{ flexGrow: 1, p: 2 }}>
              {output.map((line, index) => (
                <Typography key={index} sx={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </>
  );
};

export default Dashboard;
