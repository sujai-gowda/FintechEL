const fs = require('fs');
const path = require('path');

const storageDir = path.join(__dirname, '..', 'storage');

const getFilePath = (filename) => path.join(storageDir, `${filename}.json`);

const readJSONFile = (filename) => {
  try {
    const filePath = getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}.json:`, error);
    return [];
  }
};

const writeJSONFile = (filename, data) => {
  try {
    const filePath = getFilePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}.json:`, error);
    return false;
  }
};

const updateJSONFile = (filename, id, updatedData) => {
  const data = readJSONFile(filename);
  const index = data.findIndex(item => item.id === id || item.escrowId === id || item.jobId === id || item.transactionId === id);
  
  if (index !== -1) {
    data[index] = { ...data[index], ...updatedData, updatedAt: new Date().toISOString() };
    return writeJSONFile(filename, data);
  }
  return false;
};

const addJSONRecord = (filename, record) => {
  const data = readJSONFile(filename);
  const newRecord = { 
    ...record, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.push(newRecord);
  writeJSONFile(filename, data);
  return newRecord;
};

module.exports = {
  readJSONFile,
  writeJSONFile,
  updateJSONFile,
  addJSONRecord
};
