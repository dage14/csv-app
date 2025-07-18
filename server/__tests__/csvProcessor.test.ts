import { CSVProcessor } from '../src/services/csvProcessor';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

describe('CSVProcessor', () => {
    const processor = new CSVProcessor();
    const testDir = path.join(__dirname, 'test-data');
    
    let testDataPath: string;
    let emptyFilePath: string;
    let malformedFilePath: string;

    beforeAll(async () => {
        // Create test directory
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }

        // Create test files
        testDataPath = path.join(testDir, 'test-data.csv');
        emptyFilePath = path.join(testDir, 'empty.csv');
        malformedFilePath = path.join(testDir, 'malformed.csv');

        fs.writeFileSync(testDataPath, 'New York,2023-01-01,100\nBoston,2023-01-01,50\nNew York,2023-01-01,30');
        fs.writeFileSync(emptyFilePath, '');
        fs.writeFileSync(malformedFilePath, 'department,date,sales\nElectronics,2023-01-01\nClothing,2023-01-01,invalid');
    });

    afterAll(async () => {
        // Clean up test directory
        const files = await fs.promises.readdir(testDir);
        await Promise.all(files.map(file => unlink(path.join(testDir, file))));
        await fs.promises.rmdir(testDir);
    });

    describe('processFile()', () => {
        test('correctly processes valid CSV file', async () => {
            const resultFilename = await processor.processFile(testDataPath);
            expect(resultFilename).toMatch(/^results_[a-f0-9-]+\.csv$/);
            
            const resultPath = processor.getProcessedFilePath(resultFilename);
            expect(fs.existsSync(resultPath)).toBeTruthy();
            
            // Verify file content
            const content = await readFile(resultPath, 'utf8');
            expect(content).toContain('New York,130');
            expect(content).toContain('Boston,50');
            expect(content).toMatch(/^department,totalSales\r?\n.+/);
            
            await unlink(resultPath);
        });

        test('throws error for empty file', async () => {
            await expect(processor.processFile(emptyFilePath))
                .rejects
                .toThrow('Error processing CSV: Empty file');
        }, 10000);

        test('throws error for malformed CSV', async () => {
            await expect(processor.processFile(malformedFilePath))
                .rejects
                .toThrow('Error processing CSV');
        });

        test('throws error for non-existent file', async () => {
            await expect(processor.processFile('nonexistent.csv'))
                .rejects
                .toThrow('ENOENT');
        });
    });

    describe('getProcessedFilePath()', () => {
        test('returns correct file path', () => {
            const filename = 'test.csv';
            const expectedPath = path.join(processor['tempDir'], filename);
            expect(processor.getProcessedFilePath(filename)).toBe(expectedPath);
        });

        test('handles path traversal attempts', () => {
            expect(() => processor.getProcessedFilePath('../malicious.csv'))
                .toThrow('Invalid filename');
        });
    });

    describe('temp directory', () => {
        test('is created on initialization', () => {
            const tempDir = path.join(__dirname, '../../temp');
            expect(fs.existsSync(tempDir)).toBeTruthy();
        });
    });
});