// const { execSync } = require('child_process');
//
// exports.tailLogs = () => {
//     try {
//         return execSync('tail -n 20 logs.txt').toString();
//     } catch {
//         return '[No logs available]';
//     }
// };

const fs = require('fs');

exports.tailLogs = () => {
    try {
        const lines = fs.readFileSync('logs.txt', 'utf8').trim().split('\n');
        return lines.slice(-20).join('\n');
    } catch {
        return '[No logs available]';
    }
};
