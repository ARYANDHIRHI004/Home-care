// Lightweight client-side CSV export helper (no external dependency).
// columns: [{ key, label }]  rows: array of plain objects
export function exportToCSV(filename, rows = [], columns = []) {
    if (!rows.length) return;

    const escapeCell = (value) => {
        const str = value === null || value === undefined ? '' : String(value);
        if (/[",\n]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const header = columns.map((c) => escapeCell(c.label)).join(',');
    const body = rows
        .map((row) => columns.map((c) => escapeCell(row[c.key])).join(','))
        .join('\n');

    const csvContent = `${header}\n${body}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
