const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('docs/system-diagrams');

const expectedFolders = [
  '01-system-architecture',
  '02-class-diagram',
  '03-component-diagram',
  '04-deployment-diagram',
  '05-object-diagram',
  '06-package-diagram',
  '07-composite-structure-diagram',
  '08-profile-diagram',
  '09-data-flow-diagram',
  '10-use-case-diagram',
  '11-activity-diagram',
  '12-sequence-diagram',
  '13-state-machine-diagram',
  '14-communication-diagram',
  '15-interaction-overview-diagram',
  '16-timing-diagram',
  '17-requirement-diagram'
];

console.log('=== VERIFICATION OF DOCS/SYSTEM-DIAGRAMS ===\n');

// Check root analysis files
const rootFiles = [
  '00-system-analysis.md',
  '00-feature-inventory.md',
  '00-api-and-database-map.md',
  '00-diagram-consistency-report.md'
];

for (const rf of rootFiles) {
  const p = path.join(baseDir, rf);
  if (fs.existsSync(p)) {
    console.log(`[ROOT FILE OK] ${rf} (${fs.statSync(p).size} bytes)`);
  } else {
    console.error(`[ROOT FILE MISSING] ${rf}`);
  }
}

console.log('\n=== CHECKING 17 DIAGRAM FOLDERS ===\n');
let allOk = true;

for (const folder of expectedFolders) {
  const folderPath = path.join(baseDir, folder);
  if (!fs.existsSync(folderPath)) {
    console.error(`[FOLDER MISSING] ${folder}`);
    allOk = false;
    continue;
  }

  const mmdFile = path.join(folderPath, `${folder}.mmd`);
  const svgFile = path.join(folderPath, `${folder}.svg`);
  const pngFile = path.join(folderPath, `${folder}.png`);
  const mdFile = path.join(folderPath, `${folder}.md`);

  const hasMmd = fs.existsSync(mmdFile);
  const hasSvg = fs.existsSync(svgFile);
  const hasPng = fs.existsSync(pngFile);
  const hasMd = fs.existsSync(mdFile);

  const status = (hasMmd && hasSvg && hasPng && hasMd) ? 'ALL OK' : 'INCOMPLETE';
  console.log(`[${status}] ${folder}`);
  console.log(`   .mmd: ${hasMmd ? fs.statSync(mmdFile).size + ' B' : 'MISSING'}`);
  console.log(`   .svg: ${hasSvg ? fs.statSync(svgFile).size + ' B' : 'MISSING'}`);
  console.log(`   .png: ${hasPng ? fs.statSync(pngFile).size + ' B' : 'MISSING'}`);
  console.log(`   .md : ${hasMd ? fs.statSync(mdFile).size + ' B' : 'MISSING'}`);

  if (!hasMmd || !hasSvg || !hasPng || !hasMd) allOk = false;
}

console.log(`\nOverall Integrity Check: ${allOk ? 'PERFECT - ALL 17 DIAGRAMS COMPLETE WITH 4 FILES EACH' : 'FAILED'}`);

