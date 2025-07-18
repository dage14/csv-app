import { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { CSVProcessor } from '../services/csvProcessor';

const processor = new CSVProcessor();

export class CSVController {
     public async uploadFile(req: Request, res: Response) {
        if (!req.files || !req.files.csvFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const csvFile = req.files.csvFile as fileUpload.UploadedFile;
        const tempPath = path.join(__dirname, '../../temp', csvFile.name);

        try {
            // Save uploaded file
            await csvFile.mv(tempPath);
            
            // Verify file content
            const content = fs.readFileSync(tempPath, 'utf8');
            if (!content.includes(',')) {
                fs.unlinkSync(tempPath);
                return res.status(400).json({ error: 'File must be comma-delimited' });
            }

            // Process file
            const resultFilename = await processor.processFile(tempPath);
            
            res.json({
                message: 'File processed successfully',
                downloadUrl: `/download/${resultFilename}`
            });
        } catch (error: unknown) { 
            console.error('Error:', error);
            
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Unknown error occurred';
            
            res.status(500).json({ 
                error: 'Failed to process file',
                details: errorMessage 
            });
        } finally {

            if (fs.existsSync(tempPath)) {
                fs.unlink(tempPath, () => {});
            }
        }
    }

    public downloadFile(req: Request, res: Response) {
        const { filename } = req.params;
        const filePath = processor.getProcessedFilePath(filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

       res.download(filePath, `department_totals_${filename}`, (err) => {
        if (err) {
            console.error('Download failed:', err);
            if (!res.headersSent) {
                res.status(500).send('Download failed');
            }
        }
    });
    }
}