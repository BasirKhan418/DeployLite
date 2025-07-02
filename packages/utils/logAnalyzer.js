exports.analyzeLogs = (logs) => {
    if (logs.includes('ENOMEM') || logs.includes('Out of memory')) {
        return {
            reason: 'Memory exhaustion',
            suggestion: 'Restart container with more memory'
        };
    }

    if (logs.includes('EADDRINUSE') || logs.includes('address already in use')) {
        return {
            reason: 'Port conflict',
            suggestion: 'Change container port or free it'
        };
    }

    return {
        reason: 'Unknown error',
        suggestion: 'Check logs manually'
    };
};
