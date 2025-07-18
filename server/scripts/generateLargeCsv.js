const fs = require('fs');
const path = require('path');

const FILE_SIZE_MB = 15; // Adjust as needed
const LINES_PER_MB = 15000; // Approximate for this data structure
const OUTPUT_PATH = path.join(__dirname, '../temp/large_dataset.csv');

function generateLargeCsv() {
  console.log(`Generating ${FILE_SIZE_MB}MB CSV file...`);
  const startTime = Date.now();
  
  // Header
  let csvContent = 'department,date,sales\n';
  
  // Generate data
  const departments = ['Electronics', 'Clothing', 'Home', 'Garden', 'Sports'];
  const totalLines = FILE_SIZE_MB * LINES_PER_MB;
  
  for (let i = 0; i < totalLines; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const date = `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const sales = Math.floor(Math.random() * 1000);
    csvContent += `${dept},${date},${sales}\n`;
    
    // Write in chunks to avoid memory issues
    if (i % 100000 === 0 && i > 0) {
      fs.appendFileSync(OUTPUT_PATH, csvContent);
      csvContent = '';
      console.log(`Progress: ${((i / totalLines) * 100).toFixed(1)}%`);
    }
  }
  
  // Write remaining content
  if (csvContent.length > 0) {
    fs.appendFileSync(OUTPUT_PATH, csvContent);
  }
  
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`Generated ${(stats.size / (1024 * 1024)).toFixed(2)}MB file in ${(Date.now() - startTime) / 1000}s`);
  console.log(`File saved to: ${OUTPUT_PATH}`);
}

// Ensure temp directory exists
if (!fs.existsSync(path.dirname(OUTPUT_PATH))) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
}

generateLargeCsv();