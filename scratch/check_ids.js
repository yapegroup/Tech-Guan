const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

const regex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const missing = new Set();
const found = new Set();

while ((match = regex.exec(js)) !== null) {
  const id = match[1];
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    missing.add(id);
  } else {
    found.add(id);
  }
}

console.log('--- MISSING DOM IDs referenced in app.js ---');
console.log(Array.from(missing));

console.log('\n--- FOUND DOM IDs ---');
console.log(Array.from(found).length, 'IDs found.');
