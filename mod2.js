const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(website)/services/page.js', 'utf8');

// 1. Remove states
content = content.replace(/const \[minRating, setMinRating\] = useState\(0\);\r?\n/, '');
content = content.replace(/const \[onlyPopular, setOnlyPopular\] = useState\(false\);\r?\n/, '');
content = content.replace(/const \[isFilterDrawerOpen, setIsFilterDrawerOpen\] = useState\(false\);\r?\n/, '');

// 2. Remove from filteredServices
content = content.replace(/const matchesRating = service\.rating >= minRating;\r?\n\s*/, '');
content = content.replace(/const matchesPopular = !onlyPopular \|\| service\.popular;\r?\n\s*/, '');
content = content.replace(/ && matchesRating && matchesPopular/, '');
content = content.replace(/, minRating, onlyPopular/, '');

// 3. Remove Mobile Filter Trigger Button
content = content.replace(/\{\/\* Mobile Filter Trigger Button \*\/\}[\s\S]*?(?=<\/div>\r?\n\s*<\/div>\r?\n\s*<main)/, '');

// 4. Remove Desktop Sidebar
content = content.replace(/\{\/\* DESKTOP FILTER SIDEBAR \*\/\}[\s\S]*?(?=\{\/\* MAIN SERVICE GRID \*\/\})/, '');

// 5. Remove layout wrappers for sidebar
content = content.replace(/<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">\s*/, '');
content = content.replace(/<div className="lg:col-span-9 space-y-6">/, '<div className="space-y-6">');
// Need to remove the closing div for the grid wrapper. The grid wrapper closes before the '6. WHY CHOOSE HOMECARE' section.
content = content.replace(/<\/div>\r?\n\s*\{\/\* ==========================================\r?\n\s*6\. WHY CHOOSE HOMECARE/, '  {/* ==========================================\n            6. WHY CHOOSE HOMECARE');

// 6. Remove Mobile Drawer
content = content.replace(/\{\/\* ==========================================\r?\n\s*9\. MOBILE SLIDE-OUT FILTER DRAWER\r?\n\s*========================================== \*\/\}[\s\S]*?(?=\{\/\* ==========================================\r?\n\s*10\. LEARN MORE \/ QUICK VIEW MODAL)/, '');

// 7. Remove Reset All Filters references
content = content.replace(/\s*setMinRating\(0\);\r?\n/, '\n');

fs.writeFileSync('frontend/src/app/(website)/services/page.js', content);
