import fs from 'fs';

// Beginner-safe starter script.
// This creates/keeps a jobs.json file. Later you can add real APIs here.
const filePath = './public/jobs.json';
let existing = { jobs: [] };
if (fs.existsSync(filePath)) existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));

existing.updated = new Date().toISOString().split('T')[0];
fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
console.log(`Updated ${filePath} on ${existing.updated}`);
