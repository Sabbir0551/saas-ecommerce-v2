const fs = require('fs');
const path = require('path');

const brandsDir = path.join(__dirname, '..', 'frontend', 'public', 'brands');
if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

const svgs = {
  'samsung': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="32" letter-spacing="4" fill="#034EA2">SAMSUNG</text></svg>',
  'sony': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="70%" text-anchor="middle" font-family="Georgia, serif" font-weight="900" font-size="38" letter-spacing="6" fill="#111827">SONY</text></svg>',
  'lg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="160" height="60"><g transform="translate(18, 10)"><circle cx="20" cy="20" r="18" fill="#A50034"/><circle cx="15" cy="15" r="2.5" fill="#FFFFFF"/><path d="M20 9 A11 11 0 1 1 12 26" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/><path d="M20 14 L20 23 L26 23" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/></g><text x="75" y="38" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#555" letter-spacing="2">LG</text></svg>',
  'walton': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50"><g transform="translate(10, 10)"><rect x="0" y="0" width="12" height="12" rx="2" fill="#0066B2"/><rect x="15" y="0" width="12" height="12" rx="2" fill="#00A0E9"/><rect x="0" y="15" width="12" height="12" rx="2" fill="#00A0E9"/><rect x="15" y="15" width="12" height="12" rx="2" fill="#0066B2"/></g><text x="48" y="33" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="25" letter-spacing="1.5" fill="#0066B2">WALTON</text></svg>',
  'gree': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="70%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-style="italic" font-size="34" letter-spacing="2" fill="#0083CA">GREE</text></svg>',
  'haier': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="70%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="34" letter-spacing="1" fill="#005BAC">Haier</text></svg>',
  'singer': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="70%" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="28" letter-spacing="3" fill="#D91E27">SINGER</text></svg>',
  'panasonic': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="24" letter-spacing="1.5" fill="#004098">Panasonic</text></svg>',
  'general': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="24" letter-spacing="2" fill="#E60012">GENERAL</text></svg>',
  'hitachi': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="2" fill="#E60012">HITACHI</text></svg>',
  'hisense': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="1" fill="#009999">Hisense</text></svg>',
  'whirlpool': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 50" width="170" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="1" fill="#F39200">Whirlpool</text></svg>',
  'toshiba': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="2" fill="#E50012">TOSHIBA</text></svg>',
  'philips': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="2" fill="#0B5ED7">PHILIPS</text></svg>',
  'electrolux': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="22" letter-spacing="2" fill="#011E41">Electrolux</text></svg>',
  'tuya': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><circle cx="28" cy="25" r="14" fill="#FF5B00"/><text x="52" y="33" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#FF5B00">tuya</text></svg>',
  'sonoff': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="26" letter-spacing="2" fill="#FF6B00">SONOFF</text></svg>',
  'schneider': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="20" letter-spacing="1" fill="#3DCD58">Schneider</text></svg>',
  'abb': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 50" width="140" height="50"><text x="50%" y="72%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="38" letter-spacing="3" fill="#FF000F">ABB</text></svg>',
  'siemens': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="2" fill="#00646E">SIEMENS</text></svg>',
  'havells': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="2" fill="#E31837">HAVELLS</text></svg>',
  'chint': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="3" fill="#0055A5">CHINT</text></svg>',
  'superstar': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="20" letter-spacing="1" fill="#E52421">SUPER STAR</text></svg>',
  'vision': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="24" letter-spacing="2" fill="#D32F2F">VISION</text></svg>',
  'yadea': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50"><text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="3" fill="#FF6600">YADEA</text></svg>',
  'jbe': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 50" width="140" height="50"><text x="50%" y="70%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="32" letter-spacing="3" fill="#1E40AF">JBE</text></svg>'
};

Object.entries(svgs).forEach(([name, content]) => {
  fs.writeFileSync(path.join(brandsDir, `${name}.svg`), content);
});

console.log('Successfully generated', Object.keys(svgs).length, 'brand SVGs in frontend/public/brands');
