const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(website)/services/page.js', 'utf8');

// 1. Remove priceRange from state
content = content.replace(/const \[priceRange, setPriceRange\] = useState\(3000\);\n/, '');

// 2. Remove price logic
content = content.replace(/const matchesPrice = service\.price <= priceRange;\n\s*/, '');
content = content.replace(/matchesPrice && /, '');
content = content.replace(/priceRange, /g, '');

// 3. Remove resets
content = content.replace(/\s*setPriceRange\(3000\);\n/g, '\n');

// 4. Remove UI components
content = content.replace(/\{\/\* Price Range Filter \*\/\}[\s\S]*?(?=\{\/\* Minimum Rating Filter \*\/\})/g, '');
content = content.replace(/\{\/\* Price Slider \*\/\}[\s\S]*?(?=\{\/\* Minimum Rating \*\/\})/g, '');

// 5. Replace colors
content = content.replace(/#0D9488/g, '#2563EB');
content = content.replace(/#0B7A70/g, '#1D4ED8');
content = content.replace(/teal-500/g, 'blue-500');
content = content.replace(/teal-50/g, 'blue-50');
content = content.replace(/teal-200/g, 'blue-200');

fs.writeFileSync('frontend/src/app/(website)/services/page.js', content);
