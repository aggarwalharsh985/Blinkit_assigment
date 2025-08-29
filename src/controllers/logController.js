const fs = require('fs');
const path = require('path');

const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action, email, startDate, endDate } = req.query;
        const logsPath = path.join(__dirname, '../logs/audit-logs.json');
        
        if (!fs.existsSync(logsPath)) {
            return res.status(404).json({message: "No logs found"});
        }

        // Read the log file
        const logData = fs.readFileSync(logsPath, 'utf8');
        const logs = logData.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (err) {
                    return null;
                }
            })
            .filter(log => log !== null);

        // Apply filters
        let filteredLogs = logs;

        if (action) {
            filteredLogs = filteredLogs.filter(log => log.action === action);
        }

        if (email) {
            filteredLogs = filteredLogs.filter(log => 
                log.email === email || log.adminemail === email
            );
        }

        if (startDate) {
            const start = new Date(startDate);
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
        }

        if (endDate) {
            const end = new Date(endDate);
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
        }

        // Sort by timestamp (newest first)
        filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

        res.json({
            logs: paginatedLogs,
            totalLogs: filteredLogs.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredLogs.length / limit),
            hasNextPage: endIndex < filteredLogs.length,
            hasPrevPage: page > 1
        });

    } catch (error) {
        res.status(500).json({message: "Error reading audit logs", error: error.message});
    }
};

const getLogStats = async (req, res) => {
    try {
        const logsPath = path.join(__dirname, '../logs/audit-logs.json');
        
        if (!fs.existsSync(logsPath)) {
            return res.status(404).json({message: "No logs found"});
        }

        const logData = fs.readFileSync(logsPath, 'utf8');
        const logs = logData.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (err) {
                    return null;
                }
            })
            .filter(log => log !== null);

        // Calculate statistics
        const stats = {
            totalLogs: logs.length,
            loginAttempts: {
                total: logs.filter(log => log.action === 'LOGIN_ATTEMPT').length,
                successful: logs.filter(log => log.action === 'LOGIN_ATTEMPT' && log.success === true).length,
                failed: logs.filter(log => log.action === 'LOGIN_ATTEMPT' && log.success === false).length
            },
            adminActions: logs.filter(log => log.action === 'ADMIN_ACTION').length,
            userRegistrations: logs.filter(log => log.action === 'USER_REGISTRATION').length,
            lastActivity: logs.length > 0 ? logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp : null
        };

        res.json(stats);

    } catch (error) {
        res.status(500).json({message: "Error calculating log statistics", error: error.message});
    }
};

module.exports = {
    getAuditLogs,
    getLogStats
};