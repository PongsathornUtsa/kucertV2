// FormDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

interface FormDialogProps {
    open: boolean;
    onClose: () => void;
}

interface FormData {
    name: string;
    universityName: string;
    studentId: string;
    issuedDate: string;
    signer: string;
    image: string;
}

const initialFormData: FormData = {
    name: '',
    universityName: '',
    studentId: '',
    issuedDate: '',
    signer: '',
    image: '',
};

const FormDialog: React.FC<FormDialogProps> = ({ open, onClose }) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [previewData, setPreviewData] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handlePreview = () => {
        const previewFormat = {
            name: formData.name,
            image: formData.image,
            description: {
                universityName: formData.universityName,
                studentId: formData.studentId,
                issuedDate: formData.issuedDate,
                signer: formData.signer,
            },
        };
        setPreviewData(JSON.stringify(previewFormat, null, 2));
    };

    const handleCopyToClipboard = async () => {
        if (previewData) {
            try {
                await navigator.clipboard.writeText(previewData);
                // Optionally, indicate to the user that the text was copied.
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Optionally, handle the error.
            }
        }
    };

    const handleClear = () => {
        setFormData(initialFormData);
        setPreviewData('');
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormData(initialFormData);
        setPreviewData('');
        onClose(); // Close dialog after submission
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Form Title</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField label="Name" variant="outlined" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal"  />
                    <TextField label="University Name" variant="outlined" name="universityName" value={formData.universityName} onChange={handleChange} fullWidth margin="normal"  />
                    <TextField label="Student ID" variant="outlined" name="studentId" value={formData.studentId} onChange={handleChange} fullWidth margin="normal"  />
                    <TextField label="Image" variant="outlined" name="image" value={formData.image} onChange={handleChange} fullWidth margin="normal"  />
                    <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                        <TextField label="Issued Date" variant="outlined" name="issuedDate" type="date" value={formData.issuedDate} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ flex: 1 }}  />
                        <TextField label="Signer" variant="outlined" name="signer" value={formData.signer} onChange={handleChange} sx={{ flex: 1 }}  />
                    </Box>
                    <DialogActions>
                        <Button onClick={handlePreview}>Preview</Button>
                        <Button onClick={handleClear}>Clear</Button>
                        <Button type="submit">Finish</Button>
                    </DialogActions>
                </form>
                {previewData && (
                    <>
                        <pre>{previewData}</pre>
                        <Button onClick={handleCopyToClipboard}>Copy Output</Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
