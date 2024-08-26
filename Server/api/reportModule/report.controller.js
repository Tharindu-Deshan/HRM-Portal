const pool= require("../../db/database");

const {
    getEmployeeByDepartment,
    getEmployeeByJobtitle,
    getEmployeeByPaygrade,
    getTotalLeavesInGivenPeriodByDepartment,
    getEmployeeDetails,
    getReportByCustomAttributes,
    getCustomAttributes
}=require('./report.servise');

module.exports={
    reports : async (req, res) => {
        console.log("> reports");
        console.log(req.body);
    
        let connection;
    
        try {
            const reportNO = req.body.reportNO;
            // console.log(reportNO);
    
            connection = await pool.getConnection();
    
            if (reportNO == 1) {
                const result = await getEmployeeByDepartment(connection);
                
                return res.json({ success: 1, data: result });
            }else if (reportNO == 2) {
                const result = await getTotalLeavesInGivenPeriodByDepartment(connection,req.body);

                return res.json({success: 1,data: result})
            }else if(reportNO==3){
                const result1 = await getEmployeeByDepartment(connection);
                const result2 = await getEmployeeByJobtitle(connection);
                const result3 = await getEmployeeByPaygrade(connection);

                return res.json({ success: 1, data1: result1, data2: result2, data3: result3});
            }else if (reportNO==4){
                const result = await getReportByCustomAttributes(connection,req.body.AttributeName);
                
                return res.json({ success: 1, data: result[0]});
            }else if (reportNO==5){
                const result = await getEmployeeDetails(connection);
                return res.json({ success: 1, data: result });
            }
            else {
                return res.json({ success: 0, message: "Invalid report number" });
            }
        } catch (error) {
            console.error("Error in the reports route:", error);
            return res.status(500).json({ success: 0, error: "Internal server error" });
        } finally {
            console.log("<")
            if (connection) {
                connection.release(); 
            }
        }
    },
    getCustomAttributes: async (req, res) => {
        console.log("> getCustomAttributes");
        let connection;
        try {
            connection = await pool.getConnection();
            const result = await getCustomAttributes(connection);
            connection.release(); // Always release the connection after using it
            res.status(200).json(result[0]); // Send the result as JSON
        } catch (error) {
            console.error("Error fetching custom attributes:", error);
            if (connection) connection.release(); // Release the connection in case of an error
            res.status(500).json({ message: "Internal Server Error" }); // Send error response
        }
    } 
};