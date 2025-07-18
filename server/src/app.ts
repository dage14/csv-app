import express, { Express } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { CSVController } from './controllers/csvController';
import path from 'path';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
//app.use('/temp', express.static('temp')); // Serve processed files
const tempDir = path.join(__dirname, '../../temp');
app.use('/download', express.static(tempDir, {
  setHeaders: (res) => {
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment');
  }
}));

// Routes
const csvController = new CSVController();
app.post('/upload', csvController.uploadFile.bind(csvController));
app.get('/download/:filename', csvController.downloadFile.bind(csvController));
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CSV App Server is running' });
});
export default app;