import fs from 'fs';
import path from 'path';
import { stringify } from 'csv-stringify';
import csv from 'csv-parser'
import { v4 as uuidv4 } from 'uuid';
import { Worker } from 'worker_threads';

export class CSVProcessor {
    private tempDir: string;

    constructor() {
        this.tempDir = path.join(__dirname, '../../temp');
        this.ensureTempDir();
    }

    private ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    public async processFile(inputPath: string): Promise<string> {
        if (!fs.existsSync(inputPath)) {
            throw new Error('ENOENT');
        }

        const stats = fs.statSync(inputPath);
        if (stats.size === 0) {
            throw new Error('Error processing CSV: Empty file');
        }

        return new Promise((resolve, reject) => {
            const departments = new Map<string, number>();
            const outputFilename = `results_${uuidv4()}.csv`;
            const outputPath = path.join(this.tempDir, outputFilename);

            fs.createReadStream(inputPath)
                .pipe(csv({
                    headers: ['department', 'date', 'sales'],
                    skipLines: 0
                }))
                .on('data', (data: any) => {
                    try {
                        const dept = data.department;
                        const sales = Number(data.sales);
                        if (isNaN(sales)) {
                            throw new Error('Invalid sales data');
                        }
                        departments.set(dept, (departments.get(dept) || 0) + sales);
                    } catch (error) {
                        reject(new Error('Error processing CSV: Invalid data format'));
                    }
                })
                .on('end', () => {
                    const results = Array.from(departments.entries())
                        .map(([department, totalSales]) => ({ department, totalSales }));

                    stringify(results, {
                        header: true,
                        columns: ['department', 'totalSales']
                    }, (err, output) => {
                        if (err) return reject(err);
                        fs.writeFile(outputPath, output, (err) => {
                            if (err) return reject(err);
                            resolve(outputFilename);
                        });
                    });
                })
                .on('error', () => {
                    reject(new Error('Error processing CSV'));
                });
        });
    }

    public getProcessedFilePath(filename: string): string {
        if (filename.includes('../') || filename.includes('..\\')) {
            throw new Error('Invalid filename');
        }
        return path.join(this.tempDir, filename);
    }

    public async processFileWithWorker(inputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, '../workers/csvWorker.js'), {
        workerData: { filePath: inputPath }
      });

      worker.on('message', (message) => {
        if (message.success) {
          resolve(message.filename);
        } else {
          reject(new Error(message.error));
        }
        worker.terminate();
      });

      worker.on('error', (error) => {
        reject(error);
        worker.terminate();
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}