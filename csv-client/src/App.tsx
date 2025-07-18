import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl("");
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDownloadUrl(response.data.downloadUrl);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to process file");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom align="center">
        Department Sales Processor
      </Typography>

      <Box sx={{ my: 3 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          fullWidth
        >
          Select CSV File
          <input type="file" accept=".csv" hidden onChange={handleFileChange} />
        </Button>
        {file && (
          <Typography sx={{ mt: 2 }} align="center">
            Selected: {file.name}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || isProcessing}
        fullWidth
        sx={{ mb: 3 }}
      >
        {isProcessing ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Process CSV"
        )}
      </Button>

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {downloadUrl && (
        <Box sx={{ mt: 3, p: 2, bgcolor: "success.light", borderRadius: 1 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Processing Complete!
          </Typography>
          <Button
            variant="contained"
            color="success"
            //href={downloadUrl}
            href={`http://localhost:5000${downloadUrl}`}
            download
            fullWidth
          >
            Download Results
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
        <Typography variant="subtitle1">Required CSV Format:</Typography>
        <Typography
          variant="body2"
          component="div"
          sx={{ fontFamily: "monospace" }}
        >
          <pre>{`Department,Date,Sales\nNew York,2023-01-01,100\nBoston,2023-01-01,50`}</pre>
        </Typography>
      </Box>
    </Paper>
  );
}
export default App;
