import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Modal } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import {uploadDocument} from "../services/DocumentService.tsx";
import Typography from "@mui/material/Typography";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function UploadFileModal({ open, handleClose }: any) {
    const [fileName, setFileName] = useState('No file selected');
    const [metadata, setMetadata] = useState([]);
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>("");
    const [uploadSuccess, setUploadSuccess] = useState<string>("");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setFile(null);
            setFileName('No file selected');
        }
    };

    const handleAddMetadataField = () => {
        setMetadata([...metadata, { key: "", value: "" }]);
    };

    const onClose = () => {
        handleClose(false);
    }

    const handleMetadataChange = (index: number, key: string, value: string) => {
        const updatedMetadata = [...metadata];
        updatedMetadata[index] = { key, value };
        setMetadata(updatedMetadata);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadError("Please Choose a file");
            setTimeout(() => {
                setUploadError("");
            }, 1500);
            return;
        }
        const regExp = /^[A-Za-z]+$/;
        const empty = /^$/;
        let isValidMetadata = true;

        metadata.forEach((field, index) => {
            if (!regExp.test(field.key) || empty.test(field.value)) {
                setUploadError("Invalid metadata. Metadata keys should only contain letters (A-Z, a-z) and values cannot be empty.");
                isValidMetadata = false; // Set flag to false if any metadata is invalid
            }
        });

        if (isValidMetadata) {
            try {
                const formData = new FormData();
                formData.append('document', file);
                formData.append('metadata', JSON.stringify(metadata));
                await uploadDocument(formData);

                setUploadSuccess("Document uploaded successfully.");
                setTimeout(() => {
                    setUploadSuccess("");
                    navigate("/");
                }, 1500);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.status === 409) {
                    setUploadError("Invalid User Credentials");
                } else if (error.response && error.response.data && error.response.data.message) {
                    setUploadError(error.response.data.message);
                }
                // Clear error after 2 seconds
                setTimeout(() => {
                    setUploadError("");
                }, 2000);
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{ marginBottom: '20px' }}>
                    <Typography style={{paddingBottom: 20}} variant="h4">
                        Upload Document
                    </Typography>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        style={{ marginBottom: '10px' }}
                    >
                        Choose File
                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                    </Button>
                    {fileName && <Typography style={{paddingBottom: 20}} variant="body1">
                        {fileName}
                    </Typography>}
                    <Button onClick={handleAddMetadataField} variant="contained" style={{ marginBottom: '10px' }}>Add Metadata</Button>
                    <div>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { marginBottom: '10px', width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            {metadata.map((field, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <TextField
                                        id={`outlined-error-helper-text-key-${index}`}
                                        label="Key"
                                        type="text"
                                        value={field.key}
                                        onChange={(e) =>
                                            handleMetadataChange(index, e.target.value, field.value)
                                        }
                                    />
                                    <TextField
                                        id={`outlined-error-helper-text-value-${index}`}
                                        label="Value"
                                        type="text"
                                        placeholder="Value"
                                        value={field.value}
                                        onChange={(e) =>
                                            handleMetadataChange(index, field.key, e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </Box>
                    </div>
                    {uploadSuccess && (
                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            {uploadSuccess}
                        </Alert>
                    )}
                    {uploadError && (
                        <Alert severity="error">
                            {uploadError}
                        </Alert>
                    )}
                    <Button variant="contained" onClick={handleUpload} style={{ marginBottom: '10px' }}>Save</Button>
                </div>
            </Box>
        </Modal>
    );
}
