import { Box, Grid, Paper, Typography, TextField, Button, InputLabel, Select, MenuItem, SelectChangeEvent, FormControl } from '@mui/material';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

//From Smart Contract
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";

import ContractInterface from "../../abiFile.json";

import FormDialog from './FormDialog';
import { useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem'

const Admin = () => {
  const [output, setOutput] = useState<string[]>([]);

  const appendOutput = (newOutput: string) => {
    setOutput(prevOutput => [...prevOutput, newOutput]);
  };

  //--------------------------------------Wagmi------------------------------
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

  //------------------------------Search Token URI--------------------------
  const [searchTokenId, setSearchTokenId] = useState('');
  const [totalMinted, setTotalMinted] = useState(0);
  const [tokenId, setTokenId] = useState("");
  const [prepareTokenURIRead, setPrepareTokenURIRead] = useState(false);

  useContractRead({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: "tokenCounter",
    watch: true,
    onSuccess(data) {
      if (data) {
        const total = parseInt(data.toString(), 10);
        setTotalMinted(total - 1);
        setPrepareOwnerRead(false);
      }
    },
  });

  useEffect(() => {
    if (totalMinted) {
      console.log('Total mint:', totalMinted);
    }
  }, [totalMinted]);

  useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ContractInterface,
    functionName: "tokenURI",
    args: [tokenId],
    enabled: prepareTokenURIRead,
    onSuccess(data) {
      if (data) {
        console.log(`Token URI for token ID ${tokenId}: ${data}`);
        appendOutput(JSON.stringify(data));
        setPrepareTokenURIRead(false); // Reset the state to avoid repeated calls
      }
    },
  });

  const handleSearchTokenIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTokenId(e.target.value);
  };

  const handleSubmitSearchTokenURI = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tokenIdInt = parseInt(searchTokenId, 10);

    if (!Number.isInteger(tokenIdInt) || tokenIdInt > totalMinted) {
      alert("Invalid Token ID. Please enter a valid Token ID within the range of minted tokens.");
      return;
    }

    setTokenId(searchTokenId); // Update tokenId state
    setPrepareTokenURIRead(true); // Trigger the useContractRead hook
  };

  //-------------------------Manage Role------------------------------

  const { data: universityRole } = useContractRead({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: "UNIVERSITY_ROLE",
  });

  const [Role, setRole] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  const { config: grantRoleConfig } = usePrepareContractWrite({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: "grantRole",
    args: [universityRole, selectedAccount],
    enabled: !!(Role == "University" && selectedAccount), // Enable when both selectedRole and selectedAccount are set
  });

  // Write to the contract using the grantRole hook
  const { write: grantRoleWrite, isSuccess: granted } = useContractWrite(grantRoleConfig);

  const { config: revokeRoleConfig } = usePrepareContractWrite({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: "revokeRole",
    args: [universityRole, selectedAccount],
    enabled: !!(Role == "University" && selectedAccount), // Enable when both selectedRole and selectedAccount are set
  });

  const { write: revokeRoleWrite, isSuccess: revoked } = useContractWrite(revokeRoleConfig);

  const handleChangeRole = (event: SelectChangeEvent) => {
    const newRole = event.target.value as string;
    setRole(newRole);
    console.log(newRole)
  }

  const handleChangeAccount = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedAccount(event.target.value);
    console.log(event.target.value)
  };

  const [lastClicked, setLastClicked] = useState("");

  const handleButtonClick = (action: string) => {
    setLastClicked(action);
  };

  const handleRoleAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(lastClicked); // This should log 'grant' or 'revoke'

    if (lastClicked === "grant") {
      console.log("Granting role:", universityRole, "to account:", selectedAccount);
      grantRoleWrite?.();
    } else if (lastClicked === "revoke") {
      console.log("Revoking role from account:", selectedAccount);
      revokeRoleWrite?.();
      //appendOutput('Role Revoked');
    }
  };

  useEffect(() => {
    if (granted) {
      appendOutput('Role Granted Successfully');
      setLastClicked('');
    }
  }, [granted]);

  useEffect(() => {
    if (revoked) {
      appendOutput('Role Revoked Successfully');
      setLastClicked('');
    }
  }, [revoked]);

  //---------------------------------------Check Owner-------------------------

  const [checkTokenId, setCheckTokenId] = useState<number | null>(null)
  const [prepareOwnerRead, setPrepareOwnerRead] = useState(false);
  const [owner, setOwner] = useState('')

  useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ContractInterface,
    functionName: 'ownerOf',
    args: checkTokenId !== null ? [checkTokenId] : [],
    enabled: prepareOwnerRead,
    onSuccess(data) {
      if (data) {
        setOwner(data as string);
        setPrepareOwnerRead(false);
      }
    },
  });

  useEffect(() => {
    if (owner) {
      console.log('Owner:', owner);
      appendOutput(`Owner: ${owner}`);
      setOwner('')
    }
  }, [owner]);

  const checkOwnerHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Checking owner for tokenId:', checkTokenId);

    if (checkTokenId !== null && (checkTokenId < 0 || isNaN(checkTokenId) || checkTokenId > totalMinted)) {
      alert('Invalid TokenId. Please enter a valid tokenId.');
      setCheckTokenId(null);
      setPrepareOwnerRead(false); // Reset in case of invalid tokenId
    } else {
      setPrepareOwnerRead(true);
    }
  };

  //------------------------------------Transfer----------------------------

  const [transferData, setTransferData] = useState({
    fromAddress: '',
    toAddress: '',
    transfertokenId: '',
    prepareTransfer: false,
  });

  const { config: TransferConfig } = usePrepareContractWrite({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: 'universitySafeTransferFrom',
    args: [transferData.fromAddress, transferData.toAddress, transferData.transfertokenId],
    enabled: transferData.prepareTransfer,
    onError(error) {
      console.log(`transfer: ${error}`)
    },
  })

  const { write: transfer, isSuccess: transfered } = useContractWrite(TransferConfig)

  const handleInputChange = (field: keyof typeof transferData, value: string) => {
    setTransferData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmitTransfer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tokenIdInt = parseInt(transferData.transfertokenId, 10);
    if (!Number.isInteger(tokenIdInt) || tokenIdInt > totalMinted) {
      alert('Please enter a valid tokenId');
      return;
    }
    setTransferData({ ...transferData, prepareTransfer: true });
    transfer?.();
  };

  useEffect(() => {
    if (transfered) {
      appendOutput(`Success transfer token ID ${transferData.transfertokenId} from ${transferData.fromAddress} to ${transferData.toAddress}`);
      setTransferData({
        fromAddress: '',
        toAddress: '',
        transfertokenId: '',
        prepareTransfer: false
      });
    }
  }, [transfered]);

  //---------------------------------Signature-------------------------------------
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const [recoveredAddress, setRecoveredAddress] = useState<string | undefined>();
  const { data: signMessageData, signMessage, variables } = useSignMessage()
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        const recovered = await recoverMessageAddress({
          message: variables.message,
          signature: signMessageData,
        })
        setRecoveredAddress(recovered)
      }
    })()
  }, [signMessageData, variables?.message])

  const handleSignClick = () => {
    signMessage({ message })
    setMessage("");
  }

  useEffect(() => {
    if (recoveredAddress) {
      console.log('Recovered Address:', recoveredAddress);
      appendOutput(`Recovered Address: ${recoveredAddress}`);
      appendOutput(`Signature: ${signMessageData}`);
    }
  }, [recoveredAddress]);

  //---------------------------set Signature------------------

  const [signature, setSignature] = useState("");
  const [signatureTokenId, setSignatureTokenId] = useState("");

  const { config: setSignatureConfig } = usePrepareContractWrite({
    abi: ContractInterface,
    address: CONTRACT_ADDRESS,
    functionName: "setCertificateSignature",
    args: [parseInt(signatureTokenId, 10), signature],
    enabled: !!(signatureTokenId && signature),
  });

  const { write: setSignatureWrite , isSuccess: setted} = useContractWrite(setSignatureConfig);

  const handleSubmitSetSignature =  (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tokenIdInt = parseInt(signatureTokenId, 10);
    if (!Number.isInteger(tokenIdInt) || tokenIdInt > totalMinted) {
      alert('Please enter a valid tokenId');
      return;
    }
    setSignatureWrite?.();
  };

  useEffect(() => {
    if (setted) {
      appendOutput(`Saved token signature successfully`);
      setSignature('');
      setSignatureTokenId('')
    }
  }, [setted]);

  return (
    <>
      <Box>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Paper component="form" onSubmit={handleSubmitSearchTokenURI} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Search TokenURI</Typography>
              <TextField
                label="Enter Token ID"
                value={searchTokenId}
                onChange={handleSearchTokenIdChange}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained">Search</Button>
            </Paper>

            <Paper
              component="form"
              onSubmit={handleRoleAction}
              sx={{ p: 2, mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Manage Role</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={Role}
                  onChange={handleChangeRole}
                  label="Role"
                  required
                >
                  <MenuItem value="University">University</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Enter account address"
                value={selectedAccount}
                onChange={handleChangeAccount}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Button type="submit" onClick={() => handleButtonClick('grant')} variant="contained" fullWidth>Grant</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button type="submit" onClick={() => handleButtonClick('revoke')} variant="contained" fullWidth>Revoke</Button>
                </Grid>
              </Grid>

            </Paper>

          </Grid>

          <Grid item xs={12} md={4}>
            <Paper component="form" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Enter a message to sign</Typography>
              <TextField
                label="...Metadata"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Button variant="contained" onClick={handleSignClick} fullWidth>Sign</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" onClick={handleOpenDialog} fullWidth>Template</Button>
                  <FormDialog open={isDialogOpen} onClose={handleCloseDialog} />
                </Grid>
              </Grid>
            </Paper>

            <Paper
              component="form"
              onSubmit={handleSubmitSetSignature}  
              sx={{ p: 2, mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Set a signature for specific token id</Typography>
              <TextField
                label="Enter Token ID"
                value={signatureTokenId} 
                onChange={(e) => setSignatureTokenId(e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Enter Signature"
                value={signature} 
                onChange={(e) => setSignature(e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained">Save Signature</Button>
            </Paper>

          </Grid>


          <Grid item xs={12} md={4}>
            <Paper
              component="form"
              onSubmit={checkOwnerHandler}
              sx={{ p: 2, mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Check Token owner</Typography>
              <TextField
                label="Enter Token ID"
                value={checkTokenId || ''}
                onChange={e => setCheckTokenId(Number(e.target.value))}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained">Check Owner</Button>
            </Paper>

            <Paper
              component="form"
              onSubmit={handleSubmitTransfer}
              sx={{ p: 2, mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Transfer to Student Wallet</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Source Address"
                    value={transferData.fromAddress}
                    onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Token ID"
                    value={transferData.transfertokenId}
                    onChange={(e) => handleInputChange('transfertokenId', e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
              <TextField
                label="Destination Address"
                placeholder="Enter to account address"
                value={transferData.toAddress}
                onChange={(e) => handleInputChange('toAddress', e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained">Transfer</Button>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              sx={{
                height: '80pt',
                pl: 2,
                backgroundColor: 'black',
                color: 'limegreen',
                fontFamily: 'monospace',
                mb: 2,
                position: 'relative'
              }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Terminal</Typography>
              <Box sx={{
                position: 'absolute',
                top: '10pt', // Adjust this value based on the height of the title and padding
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                overflowY: 'auto'
              }}>
                {output.map((line, index) => (
                  <Typography key={index} sx={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', margin: 0 }}>
                    {line}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </>
  );

};
export default Admin;
