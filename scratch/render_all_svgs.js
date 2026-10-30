const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('docs/system-diagrams');
const cfgPath = 'C:/Users/reshd/.gemini/antigravity/brain/4e39a681-bf81-4a16-be4d-b0f30cb73939/scratch/mermaid-config.json';

const diagramIds = [
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

for (const id of diagramIds) {
  const mmdFile = path.join(baseDir, id, `${id}.mmd`);
  const svgFile = path.join(baseDir, id, `${id}.svg`);
  
  console.log(`Rendering ${id}...`);
  try {
    const cmd = `npx -p @mermaid-js/mermaid-cli mmdc -i "${mmdFile}" -o "${svgFile}" -c "${cfgPath}" -b white`;
    execSync(cmd, { stdio: 'pipe' });
    console.log(`Successfully rendered ${svgFile} (${fs.statSync(svgFile).size} bytes)`);
  } catch (err) {
    console.error(`Failed to render ${id} via mmdc:`, err.message);
  }
}

console.log('Rendering pass completed.');

