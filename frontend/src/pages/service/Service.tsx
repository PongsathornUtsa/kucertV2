import { Box, Grid, Paper, Typography, TextField, Button } from '@mui/material';
import { useState, useEffect, FormEvent } from 'react';

// From Smart Contract
import {
    useContractRead,
} from "wagmi";
import ContractInterface from "../../../../backend/abiFile.json";

const Service = () => {
    const [output, setOutput] = useState<string[]>([]);
    const [retrieveTokenId, setRetrieveTokenId] = useState("");
    const [signature, setSignature] = useState("");
    const [trigger, setTrigger] = useState(false);

    // Constants
    const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

    // Append output function
    const appendOutput = (newOutput: string) => {
        setOutput(prevOutput => [...prevOutput, newOutput]);
    };

    // Read total minted tokens
    const [totalMinted, setTotalMinted] = useState(0);
    useContractRead({
        abi: ContractInterface,
        address: CONTRACT_ADDRESS,
        functionName: "tokenCounter",
        watch: true,
        onSuccess(data) {
            if (data) {
                const total = parseInt(data.toString(), 10);
                setTotalMinted(total - 1);
            }
        },
    });

    useEffect(() => {
        if (totalMinted) {
            console.log('Total mint:', totalMinted);
        }
    }, [totalMinted]);

    // Read certificate signature
    useContractRead({
        address: CONTRACT_ADDRESS,
        abi: ContractInterface,
        functionName: "getCertificateSignature",
        args: [parseInt(retrieveTokenId, 10)],
        enabled: trigger,
        onSuccess(data) {
            if (data) {
                setSignature(data.toString());
            }
        },
    });

    // Form submission for signature retrieval
    const handleSubmitSearchSignature = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const tokenIdInt = parseInt(retrieveTokenId, 10);
        if (!Number.isInteger(tokenIdInt) || tokenIdInt > totalMinted) {
            alert("Invalid Token ID. Please enter a valid Token ID within the range of minted tokens.");
            setRetrieveTokenId(""); // Reset token ID input
            return;
        }
        setTrigger(true);
    };

    // Update output when signature is retrieved
    useEffect(() => {
        if (signature) {
            appendOutput(`Signature: ${signature}`);
            setSignature(""); // Reset signature state
        }
    }, [signature]);

    return (
        <Box>
            <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} md={4}>
                    <Paper component="form" onSubmit={handleSubmitSearchSignature} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>
                            Retrieve Signature for token id
                        </Typography>
                        <TextField
                            label="Enter Token ID"
                            variant="outlined"
                            fullWidth
                            required
                            value={retrieveTokenId}
                            onChange={(e) => setRetrieveTokenId(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained">Search</Button>
                    </Paper>
                    <Paper component="form" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', paddingBottom: '10pt' }}>Verify a sign message</Typography>
                        <TextField
                            label="Message"
                            multiline
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Signature"
                            multiline
                            variant="outlined"
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <Button type="submit" variant="contained">Search</Button>
                    </Paper>
                </Grid>

                {/* Terminal Component */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            height: '120px', // Adjusted for more space
                            pl: 2,
                            backgroundColor: 'black',
                            color: 'limegreen',
                            fontFamily: 'monospace',
                            mb: 2,
                            position: 'relative',
                            overflowY: 'auto' // Scrollable
                        }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Terminal</Typography>
                        <Box sx={{
                            position: 'absolute',
                            top: '30px', // Adjusted top position
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2
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
    );
}

export default Service;
