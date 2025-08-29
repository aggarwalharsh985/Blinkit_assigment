const winston = require('winston');
const path = require('path');
const fs = require('fs');

// logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format of JSON array
const jsonArrayFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const logEntry = {
        timestamp,
        level,
        message,
        ...meta
    };
    
    const logFilePath = path.join(logsDir, 'audit-logs.json');
    
    try {
        let existingLogs = [];
        
        // Read existing logs if file exists
        if (fs.existsSync(logFilePath)) {
            const fileContent = fs.readFileSync(logFilePath, 'utf8').trim();
            if (fileContent) {
                try {
                    existingLogs = JSON.parse(fileContent);
                    if (!Array.isArray(existingLogs)) {
                        existingLogs = [];
                    }
                } catch (parseError) {
                    // If parsing fails, start fresh
                    existingLogs = [];
                }
            }
        }
        
        // Add new log entry
        existingLogs.push(logEntry);
        
        // Keep only last 1000 entries to prevent file from getting too large
        if (existingLogs.length > 1000) {
            existingLogs = existingLogs.slice(-1000);
        }
        
        fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));
        
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
    
    return JSON.stringify(logEntry);
});

// Create audit logger
const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        jsonArrayFormat
    ),
    transports: [
        // Console output for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Create error logger
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logsDir, 'error-logs.json'),
            maxsize: 10 * 1024 * 1024,
            maxFiles: 30
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

module.exports = {
    auditLogger,
    errorLogger
};