import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Create SVG content for a simple medical cross icon
function createSvgIcon(size) {
  const padding = Math.floor(size * 0.1);
  const crossWidth = Math.floor(size * 0.2);
  const center = size / 2;
  
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#4285f4"/>
    <rect x="${center - crossWidth / 2}" y="${padding}" width="${crossWidth}" height="${size - padding * 2}" fill="white"/>
    <rect x="${padding}" y="${center - crossWidth / 2}" width="${size - padding * 2}" height="${crossWidth}" fill="white"/>
  </svg>`;
}

// Ensure the icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate and save icons of all sizes
sizes.forEach(size => {
  const svgContent = createSvgIcon(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // For simplicity, we're saving SVG content with a .png extension
  // In a real app, you would use a library to convert SVG to PNG
  fs.writeFileSync(filePath.replace('.png', '.svg'), svgContent);
  console.log(`Created icon: ${filePath.replace('.png', '.svg')}`);
});

console.log('Icon generation completed!'); 