const pool = require("../../db/database");

module.exports = {
    getEmployeeByDepartment: async (connection) => {
        console.log("___getEmployeeByDepartment")
        try {
            const query = `SELECT * FROM EmployeeByDepartment`;
            const result = await connection.query(query);
            return result[0];
        } catch (error) {
            console.error("Error while retrieving employees by department:", error);
            throw new Error("Couldn't fetch employee data by department");
        }
    },
    getEmployeeByJobtitle: async (connection) => {
        console.log("___getEmployeeByJobtitle")
        try {
            const query = `SELECT * FROM EmployeeByJobtitle`;
            const result = await connection.query(query);
            return result[0];
        } catch (error) {
            console.error("Error while retrieving employees by Jobtitle:", error);
            throw new Error("Couldn't fetch employee data by Jobtitle");
        }
    },
    getEmployeeByPaygrade: async (connection) => {
        console.log('___getEmployeeByPaygrade')
        try {
            const query = `SELECT * FROM EmployeeByPaygrade`;
            const result = await connection.query(query);
            return result[0];
        } catch (error) {
            console.error("Error while retrieving employees by Paygrade:", error);
            throw new Error("Couldn't fetch employee data by Paygrade");
        }
    },
    getTotalLeavesInGivenPeriodByDepartment: async (connection, data) => {
        console.log("___getTotalLeavesInGivenPeriodByDepartment");
        try {
            const query = `
            SELECT DepartmentName, COUNT(*) AS LeaveCount
            FROM hrm_portal.leave
            JOIN employee ON employee.EmployeeID=leave.EmployeeID
            JOIN department ON employee.DepartmentID=department.DepartmentID
                WHERE Approved = 1 AND FirstAbsentDate BETWEEN ? AND ?
                GROUP BY DepartmentName`;
            const [result] = await connection.query(query, [data.From, data.To]);
            return result;
        } catch (error) {
            console.error("An error occurred while getting total leaves by department:", error);
            throw new Error("Coundn't fetch total leaves by department");
        }
    },
    getEmployeeDetails: async (connection) => {
        console.log("___getEmployeeDetails");
        try {
            // Construct the SQL query string
            const queryString = `SELECT * FROM employeedetailsview`;

            // Run the SQL query using the connection object
            const [rows, fields] = await connection.query(queryString);

            // Return the result
            return rows;
        } catch (error) {
            console.error('Error occurred while fetching employee details:', error);
            throw error; // Rethrow the error so it can be handled by the caller
        }
    },
    getReportByCustomAttributes: async (connection, AttributeName) => {
        console.log("___getReportByCustomAttributes");
        try {
            const result = await connection.query(
                `SELECT AttributeValue, count(*) as EmployeeCount 
                    FROM employeecustomattributes 
                    WHERE AttributeName=? 
                    GROUP BY AttributeValue`,
                [AttributeName]
            );
            return result;
        } catch (error) {
            console.error("Error fetching report by custom attributes:", error);
            throw error; // Rethrow the error so the calling function knows about it
        }
    },
    getCustomAttributes: async (connection) => {
        console.log("___getCustomAttributes: Fetching custom attributes...");

        const queryString = "SELECT DISTINCT AttributeName FROM employeecustomattributes";

        try {
            const customAttributes = await connection.query(queryString);
            return customAttributes;
        } catch (error) {
            console.error("Error fetching custom attributes:", error);
            throw error
        }
    }
}