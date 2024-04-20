import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {DocumentResponse} from "../interfaces/document.ts";
import Button from "@mui/material/Button";
import UploadFileModal from "./UpoadFileModal.tsx";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { format } from 'date-fns';
import Tooltip from "@mui/material/Tooltip";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import {OutlinedInput, styled, TablePagination} from "@mui/material";
import {useEffect, useState} from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {downloadDocument, getDocuments, searchDocument} from "../services/DocumentService.tsx";
import {useNavigate} from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    border: `2px solid ${theme.palette.grey}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0, 1),
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        borderColor: theme.palette.info.main,
    },
    '&:focus-within': {
        borderColor: theme.palette.info.main,
    },
    width: 'auto',
}));

function Row(props: { doc: DocumentResponse }) {
    const { doc } = props;
    const [open, setOpen] = React.useState(false);
    const getPermissions = (permissions): string => {
        return permissions.map(p => p.permission.toUpperCase()).join(', ');
    }
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    const handleDocumentDownload = async () => {
        try {
            const response = await downloadDocument(doc.id);
            const contentType = response.headers.get('content-type');
            let filename = "download"; // Default filename if Content-Disposition header is not present
            const contentDisposition = response.headers.get('content-disposition');

            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                filename = matches && matches.length > 1 ? matches[1] : 'download';
            }

            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error handling document download:", error);
        }
    }

    function fileSizeToString(fileSize) {
        if (fileSize < 1024) {
            return fileSize + ' Bytes';
        } else if (fileSize >= 1024 && fileSize < 1024 * 1024) {
            return (fileSize / 1024).toFixed(2) + ' KB';
        } else if (fileSize >= 1024 * 1024 && fileSize < 1024 * 1024 * 1024) {
            return (fileSize / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
            return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        }
    }

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">
                    {doc.name.length > 20 ? (
                        <Tooltip title={doc.name}>
                            <span>{truncateText(doc.name, 20)}</span>
                        </Tooltip>
                    ) : (
                        truncateText(doc.name, 20)
                    )}
                </TableCell>
                <TableCell align="left">
                    {doc.type.length > 20 ? (
                        <Tooltip title={doc.type}>
                            <span>{truncateText(doc.type, 20)}</span>
                        </Tooltip>
                    ) : (
                        truncateText(doc.type, 20)
                    )}
                </TableCell>
                <TableCell align="left">{fileSizeToString(doc.size)}</TableCell>
                <TableCell align="left">{doc.owner}</TableCell>
                <TableCell align="left">{format(doc.dateCreation, 'MM/dd/yyyy')}</TableCell>
                <TableCell align="left">{format(doc.dateModification, 'MM/dd/yyyy')}</TableCell>
                <TableCell align="left">{getPermissions(doc.permissions)}</TableCell>
                <TableCell align="center">
                    <IconButton onClick={handleDocumentDownload}>
                        <FileDownloadIcon />
                    </IconButton>
                    <IconButton>
                        <ModeEditOutlineOutlinedIcon/>
                    </IconButton>
                    <IconButton>
                        <DeleteOutlineOutlinedIcon/>
                    </IconButton>
                    <IconButton>
                        <ShareIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Additional Metadata
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Key</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {doc.metaData.map((metadataRow) => (
                                        <TableRow key={metadataRow.id}>
                                            <TableCell component="th" scope="row">
                                                {metadataRow.key}
                                            </TableCell>
                                            <TableCell>{metadataRow.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function ListDocuments() {
    const [documents, setDocuments] = useState<any>([]);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const [searchValues, setSearchValues] = useState({
        name: '',
        type: '',
        date: null,
        metadata: '',
    });

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const fetchedDocuments = await getDocuments();
                setDocuments(fetchedDocuments);
            } catch (error) {
                console.error("Error fetching documents:", error.message);
            }
        };
        fetchDocuments();
    }, []);

        const handleChangePage = (_, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        const handleInputChange = (field, value) => {
            setSearchValues({ ...searchValues, [field]: value });
        };

        const handleReset = () =>{
            navigate('/');
        }

        const handleSearch = async () => {
            let response = documents;
            if(searchValues.name.length!==0){
                 response = await searchDocument(searchValues.name)
            }else if(searchValues.type.length!==0){
                 response = await searchDocument(searchValues.type)
            }else if(searchValues.date!==null){
                const date = new Date(searchValues.date);
                date.setDate(date.getDate() + 1);
                const formattedDate = date.toISOString().split('T')[0]; // Extracts the date part from the ISO string
                response = await searchDocument(formattedDate)
            }else if(searchValues.metadata.length!==0){
                response = await searchDocument(searchValues.metadata)
            }
            setDocuments(response);
        };

        const handleOpenUploadModal = () => setOpenUploadModal(true);
        const handleCloseUploadModal = () => setOpenUploadModal(false);

        return (
            <div style={{margin: 20}}>
                <div style={{textAlign: 'right', margin: 20}}>
                    <Button variant="contained" color="primary" onClick={handleOpenUploadModal}
                            startIcon={<UploadFileIcon/>}
                    >Upload</Button>
                </div>
                <StyledPaper style={{margin: 10, padding: 20}}>
                    <OutlinedInput
                        color="info"
                        sx={{ml: 1, flex: 1}}
                        placeholder="Name"
                        value={searchValues.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    <OutlinedInput
                        color="info"
                        sx={{ml: 1, flex: 1}}
                        placeholder="Type"
                        value={searchValues.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{ml: 1, flex: 1}}
                            label="Creation Date"
                            onChange={(date) => handleInputChange('date', date)}
                            value={searchValues.date}
                        />
                    </LocalizationProvider>
                    <OutlinedInput
                        sx={{ml: 1, flex: 1}}
                        color="info"
                        placeholder="Key:Value"
                        value={searchValues.metadata}
                        onChange={(e) => handleInputChange('metadata', e.target.value)}
                    />
                    <IconButton onClick={handleSearch} type="submit" color="info" aria-label="search">
                        <SearchIcon/>
                    </IconButton>
                    <IconButton onClick={handleReset} type="reset" color="info" aria-label="reset">
                        <RestartAltIcon />
                    </IconButton>
                </StyledPaper>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Type</TableCell>
                                <TableCell align="left">Size</TableCell>
                                <TableCell align="left">Owner</TableCell>
                                <TableCell align="left">Date Creation</TableCell>
                                <TableCell align="left">Date Modification</TableCell>
                                <TableCell align="left">Permissions</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((document) => (
                                <Row key={document.id} doc={document}/>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={documents.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
                {openUploadModal && <UploadFileModal open={openUploadModal} handleClose={handleCloseUploadModal}/>}
            </div>
        );
}



/*
const fetchDocumentsPage = async () => {
    try {
        const fetchedDocuments = await getDocumentsPage();
        console.log(fetchedDocuments.documents)
    } catch (error) {
        console.error("Error fetching documents:", error.message);
    }
};*/