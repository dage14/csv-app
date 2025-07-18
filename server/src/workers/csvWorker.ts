import { parentPort, workerData } from 'worker_threads';
import { CSVProcessor } from '../services/csvProcessor';
import path from 'path';

async function processInWorker() {
  try {
    const processor = new CSVProcessor();
    const resultFilename = await processor.processFile(workerData.filePath);
    parentPort?.postMessage({ success: true, filename: resultFilename });
  } catch (error) {
    parentPort?.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

processInWorker();