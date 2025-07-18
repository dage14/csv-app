import React, { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";

export const CsvUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
    } catch (err) {
      setError("Failed to process file. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Department Sales Processor
      </Typography>

      <div style={{ margin: "20px 0" }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </div>

      {file && (
        <Typography variant="body1" style={{ margin: "10px 0" }}>
          Selected file: {file.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || isProcessing}
        startIcon={isProcessing ? <CircularProgress size={20} /> : null}
      >
        {isProcessing ? "Processing..." : "Process CSV"}
      </Button>

      {error && (
        <Typography color="error" style={{ marginTop: "10px" }}>
          {error}
        </Typography>
      )}

      {downloadUrl && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="body1" style={{ marginBottom: "10px" }}>
            Processing complete!
          </Typography>
          <Button
            variant="contained"
            color="success"
            href={downloadUrl}
            download
          >
            Download Results
          </Button>
        </div>
      )}
    </Paper>
  );
};
