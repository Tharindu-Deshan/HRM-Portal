const pool = require("../../db/database");
const bcrypt = require('bcrypt');

async function findIDs(data) {
    console.log("___findIDs");
    // console.log(data)
    const connection = await pool.getConnection();
    let newData = {};
    const queries = {
        // 'Country': 'SELECT CountryID FROM country WHERE CountryName=?',
        'JobTitleID': 'SELECT JobTitleID FROM jobtitle WHERE JobTitleName = ?',
        'DepartmentID': 'SELECT DepartmentID FROM department WHERE DepartmentName = ?',
        'PayGradeID': 'SELECT PayGradeID FROM paygrade WHERE PayGradeName = ?',
        'EmploymentStatusID': 'SELECT EmploymentStatusID FROM employmentstatus WHERE EmploymentStatusName =?',
        // 'EmergencyContactID': 'SELECT EmergencyContactID FROM emergencycontact WHERE EmergencyContactName =?',
        'SupervisorID': 'SELECT EmployeeID as SupervisorID FROM employee WHERE EmployeeName =?',
    };
    try {
        await connection.beginTransaction();
        for (const [key, query] of Object.entries(queries)) {
            const [result] = await connection.query(query, [data[key]]);
            if (result.length > 0) {
                Object.assign(newData, result[0]);
                // console.log(`${key}: ${JSON.stringify(result[0])}`);
            } else {
                newData[key] = null;
                console.log(`No result for ${key}`);
            }
        }
        // console.log(newData);
    } catch (err) {
        console.log("Error of fetching IDs from database");
    } finally {
        connection.release();
    }
    // console.log(newData);
    return newData;
}
module.exports = {
    addUser: async (connection, data) => {  //done
        console.log('___addUser')
        try {
            const UserAccountLevelID = await connection.query(
                "SELECT UserAccountLevelID FROM useraccountlevel WHERE UserAccountLevelName=?",
                [data.UserAccountLevelID]
            );
            data["UserAccountLevelID"] = UserAccountLevelID[0][0]["UserAccountLevelID"];

            const [results] = await connection.query(
                `INSERT INTO useraccount(UserID, Username, Email, EmployeeID, PasswordHash, UserAccountLevelID) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.UserID,
                    data.Username,
                    data.Email,
                    data.EmployeeID,
                    data.PasswordHash,
                    data.UserAccountLevelID
                ]
            );
            // console.log(data)
            console.log("User added Successfully")
            // return Promise.resolve(results);
            return results
        } catch (error) {
            console.log("Error")
            console.log(error)
            throw error;  // Propagate the error back to the caller
        }
    },
    addEmployee: async (connection, data) => { //done
        console.log("___addEmployee")
        // console.log(data)
        try {
            const {employeeData, dependentInfo, emergencyInfo} = data;

            const newData = await findIDs(employeeData);
            // console.log(newData)

            if (newData.SupervisorID == null){
                newData.SupervisorID = 'EM-0001';
            }

            const [results] = await connection.query(
                `CALL RegisterEmployeeAndRelatedData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    employeeData.EmployeeID,
                    employeeData.EmployeeName,
                    employeeData.DateOfBirth,
                    employeeData.Gender,
                    employeeData.MaritalStatus,
                    employeeData.Address,
                    employeeData.Country,
                    newData.DepartmentID,
                    newData.JobTitleID,
                    newData.PayGradeID,
                    newData.EmploymentStatusID,
                    newData.SupervisorID,
                    employeeData.UserAccountLevelID,
                    employeeData.UserID,
                    employeeData.Username,
                    employeeData.Email,
                    employeeData.PasswordHash,
                    dependentInfo.DependentName,
                    dependentInfo.DependentAge,
                    emergencyInfo.name1,
                    emergencyInfo.telNo1,
                    emergencyInfo.name2,
                    emergencyInfo.telNo2,
                    emergencyInfo.emergencyAddress
                ]
            );
            console.log("Employee added successfully")
            // return Promise.resolve(results);
            return results;
        } catch (error) {
            // return Promise.reject(error);
            console.log("Error")
            console.log(error)
            throw error;  // Propagate the error back to the caller
        }
    },
    addEmergencyContact: async (connection, data) => {  //done
        console.log("___addEmergencyContact")
        // First, insert the emergency contact
        // console.log(data)
        // const connection = await pool.getConnection(); //we use single connection because multiple quires available
        // await connection.beginTransaction();

        console.log(data)
        try {
            // Insert emergency contact
            const [insertResults] = await connection.query(
                `INSERT INTO EmergencyContact(PrimaryName, PrimaryPhoneNumber, SecondaryName, SecondaryPhoneNumber, Address) 
                VALUES(?,?,?,?,?)`,
                [
                    data.name1,
                    data.telNo1,
                    data.name2,
                    data.telNo2,
                    data.emergencyAddress
                ]
            );
            if (insertResults.affectedRows == 0) {
                console.log("No rows inserted!");
                throw new Error("No rows inserted!");
            }
            // After successful insertion, fetch the most recently added EmergencyContactID
            const [selectResults] = await connection.query(
                `SELECT EmergencyContactID FROM EmergencyContact
                    ORDER BY EmergencyContactID DESC
                    LIMIT 1`
            );

            // await connection.commit();
            // connection.release();
            // return Promise.resolve(selectResults[0]);
            return selectResults[0];
        } catch (error) {
            // console.log("   ____EmergencyContact inserted error: " + error)
            // await connection.rollback(); //rolls back any changes made to the database 
            // connection.release(); // releases the database connection back to the connection pool
            // return Promise.reject(error); //rejected Promise with the caught error as its reason
            console.log('Error')
            console.log(error)
            throw error;  // Propagate the error back to the caller
        }
    },
    getUserss: async () => {
        console.log("___getUsers")
        try {
            const [results] = await pool.query('SELECT * FROM useraccount');
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching users: ${error.message}`);
        }
    },
    getEmployees: async () => {
        console.log("___getEmployees")
        try {
            const [results] = await pool.query('SELECT EmployeeName FROM employee');
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching employees: ${error.message}`);
        }
    },
    getDepartments: async () => { //done
        console.log("___getDepartments")
        try {
            const [results] = await pool.query('SELECT DepartmentName FROM department');
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching departments: ${error.message}`);
        }
    },
    getSupervisors: async () => { //done
        console.log("___getSupervisors")
        try {
            const [results] = await pool.query('SELECT EmployeeID,EmployeeName FROM employee');
            // console.log(results)
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching departments: ${error.message}`);
        }
    },
    getJobTitles: async () => { //done
        console.log("___getJobTitles")
        try {
            const [results] = await pool.query('SELECT JobTitleName FROM jobtitle');
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching job titles: ${error.message}`);
        }
    },
    getCountries: async () => { //done
        console.log('___getCountries')
        try {
            const [results] = await pool.query("SELECT CountryName FROM country");
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching countries"+ ${error.message}`)
        }
    },
    getEmployeeStatus: async () => { //done
        console.log('___getEmployeeStatus')
        try {
            const [results] = await pool.query("SELECT EmploymentStatusName FROM employmentstatus");
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching countries"+ ${error.message}`)
        }
    },
    getJobTitles: async () => { //done
        console.log("___getJobTitles")
        try {
            const [results] = await pool.query('SELECT JobTitleName FROM jobtitle');
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching job titles: ${error.message}`);
        }
    },
    getPayGrades: async () => { //done
        console.log("___getPayGrades")
        try {
            const [results] = await pool.query('SELECT PayGradeName FROM paygrade');
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching job titles: ${error.message}`);
        }
    },
    getCustomAttributes: async () => {
        console.log("___getCustomAttributes")
        try{
            const [results] = await pool.query('SELECT DISTINCT AttributeName  FROM employeecustomattributes');
            return results;
        }catch(error){
            throw new Error(`An error occurred while fetching custom attributes: ${error.message}`);
        }
    },
    getTotTakenLeaveCount: async (userID) => {
        console.log("___getTotTakenLeaveCount");
        try {
            // console.log(userID);
            const [results] = await pool.query(
                'SELECT count(*) as totLeaveCount FROM useraccount JOIN employee ON useraccount.EmployeeID = employee.EmployeeID JOIN `leave` ON employee.EmployeeID = leave.EmployeeID WHERE useraccount.UserID = ? AND leave.Approved=1',
                [userID]
            );
            // console.log(results);
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching total taken leave count: ${error.message}`);
        }
    },
    getTotApprovedLeaveCount: async (connection, data) => {
        console.log("___getTotApprovedLeaveCount");
        try {
            const [results] = await connection.query(`SELECT count(*) as totApprovedLeaveCount FROM \`leave\` WHERE \`leave\`.Approved=1 and \`leave\`.EmployeeID=?`,
                [data.EmployeeID]
            );
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching total approved leave count: ${error.message}`);
        }
    },
    getTotApprovedLeaveCountByType: async (connection, data) => {
        console.log("___getTotApprovedLeaveCountByType");
        try {
            const [results] = await connection.query(`
                    SELECT LeaveType, COUNT(*) as CountApprovedByType 
                    FROM \`leave\` 
                    WHERE \`leave\`.Approved=1 and \`leave\`.EmployeeID=? 
                    GROUP BY LeaveType
                `, [data.EmployeeID]);
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching total approved leave count by types: ${error.message}`);
        }
    },
    addDependent: async (connection, data) => { //done
        console.log("___addDependent")
        // console.log(data)
        try {
            const [results] = await connection.query(
                `insert into dependentinfo(EmployeeID,DependentName,DependentAge)
                values(?,?,?)`,
                [
                    data.EmployeeID,
                    data.DependentName,
                    data.DependentAge
                ]
            )
            console.log("depedent added successfully")
            return results; // Return results to the caller
        } catch (error) {
            console.log("Error occurred while adding dependent")
            throw new Error(`An error occurred while adding a dependent: ${error.message}`);
        }
    },
    getLastUserID: async (connection) => {
        console.log("___getLastUserID")
        try {
            const [results] = await connection.query('SELECT UserID FROM useraccount ORDER BY UserID DESC LIMIT 1');
            return results;
        } catch (error) {
            throw new Error(`An error occurred while fetching last user ID: ${error.message}`);
        }
    },
    getLastEmployeeID: async (connection) => {
        console.log("___getLastEmployeeID")
        try {
            const [results] = await connection.query('SELECT EmployeeID FROM employee ORDER BY EmployeeID DESC LIMIT 1');
            return results
        } catch (error) {
            throw new Error(`An error occurred while fetching last employee ID: ${error.message}`);
        }
    },
    reqLeave: async (data) => {
        console.log("___reqLeave");
        try {
            const [results] = await pool.query(
                `INSERT INTO \`leave\` (LeaveLogDateTime, EmployeeID, Approved, Reason, LeaveType, FirstAbsentDate, LastAbsentDate, LeaveDayCount, ApprovedDateTime, ApprovedByID)
                VALUES (?, ?, 0, ?, ?, ?, ?, ?, null, null)`,
                [
                    data.LeaveLogDateTime,
                    data.EmployeeID,
                    data.reason,
                    data.leaveType,
                    data.fromDate,
                    data.toDate,
                    data.noOfDays,
                ]
            );
            console.log("Leave requested successfully");
            return results; // Return results to the caller

        } catch (error) {
            throw new Error(`An error occurred while requesting leave: ${error.message}`);
        }
    },
    getUserByUserID: (UserID, callBack) => {
        pool.query(
            `select * from useraccount where UserID=?`,
            [UserID],
            (error, results, fields) => {
                console.log(results)
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getUserByUserEmail: async (Email) => {
        console.log("__getUserByUserEmail")
        try {
            const [results] = await pool.query(`SELECT * FROM useraccount WHERE Email = ?`, [Email]);
            // console.log(results)
            return results;
        } catch (error) {
            throw error;
        }
    },
    getEmployeeIDByUserID: async (UserID) => {
        console.log("___getEmployeeIDByUserID");
        console.log(UserID);

        try {
            const [results] = await pool.query(`
                SELECT employee.EmployeeID
                FROM employee
                JOIN useraccount ON employee.EmployeeID = useraccount.EmployeeID
                WHERE useraccount.UserID = ?`,
                [UserID]
            );

            if (results.length === 0) {
                // No results found for the given UserID
                return null;
            }

            const employeeID = results[0].EmployeeID;
            // console.log(employeeID)
            return employeeID;
        } catch (error) {
            // Handle any database query errors here
            console.error("Error in getEmployeeIDByUserID:", error);
            throw error; // You may choose to handle or rethrow the error as needed
        }
    },
    getUserIDByEmployeeID: async (connection, EmployeeID) => {
        console.log("___getUserIDByEmployeeID");
        // console.log(EmployeeID);

        try {
            const [results] = await connection.query(`
                SELECT UserID
                FROM useraccount
                WHERE EmployeeID = ?`,
                [EmployeeID]
            );
            // console.log(results[0].UserID)

            if (results.length === 0) {
                // No results found for the given UserID
                return null;
            }
            return results[0].UserID;
        } catch (error) {
            // Handle any database query errors here
            console.error("Error in getUserIDByEmployeeID:", error);
            throw error; // You may choose to handle or rethrow the error as needed
        }
    },
    getUserIDAndUserAccountLvIDByEmployeeID: async (connection, EmployeeID) => {
        console.log("___getUserIDAndUserAccountLvIDByEmployeeID");
        // console.log(EmployeeID);

        try {
            const [results] = await connection.query(`
                SELECT UserID,UserAccountLevelID
                FROM useraccount
                WHERE EmployeeID = ?`,
                [EmployeeID]
            );
            console.log(results)

            if (results.length === 0) {
                // No results found for the given UserID
                return null;
            }
            return results;
        } catch (error) {
            // Handle any database query errors here
            console.error("Error in getUserIDAndUserAccountLvIDByEmployeeID:", error);
            throw error; // You may choose to handle or rethrow the error as needed
        }
    },
    getUserAccountLevelByUserID: async (connection, data) => {
        console.log("___getUserAccountLevelByUserID")
        try {
            const query = `
                SELECT 
                useraccountlevel. UserAccountLevelID,
                useraccountlevel.UserAccountLevelName,
                useraccountlevel.OwnProfileDetailsAccess,
                useraccountlevel.EveryProfileDetailsAccess,
                useraccountlevel.LeaveApproveAccess
                FROM useraccount
                JOIN useraccountlevel ON useraccount.UserAccountLevelID = useraccountlevel.UserAccountLevelID
                WHERE useraccount.userID = ?`;
            const result = await connection.query(query, [data.UserID]);
            return result[0];
        } catch (error) {
            console.error("Error while getting user account level:", error);
            throw new Error("Couldn't get user account level");
        }
    },
    getPersonalInfo: async (connection, data) => {
        console.log("___getPersonalInfo: Fetching personal info for EmployeeID:", data.EmployeeID);
        const sqlQuery = `
            SELECT 
                employee.EmployeeName,
                employee.EmployeeID,
                employee.Address,
                employee.Country,
                useraccount.Username,
                useraccount.Email,
                employee.DateOfBirth,
                employee.MaritalStatus,
                employee.Gender
            FROM useraccount 
            JOIN employee ON employee.EmployeeID = useraccount.EmployeeID
            WHERE employee.EmployeeID = ?
        `;
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return { personalInfo: results[0] };
        } catch (error) {
            console.error("Failed to fetch personal info:", error);
            throw new Error(`An error occurred while fetching personal info: ${error.message}`);
        }
    },
    getDependentInfo: async (connection, data) => {
        console.log("___getDependentInfo: Fetching dependent info for EmployeeID:", data.EmployeeID);
        const sqlQuery = `
            SELECT 
                DependentName, 
                DependentAge 
            FROM 
                dependentinfo 
            WHERE 
                EmployeeID = ?
        `;
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }

            return results;
        } catch (error) {
            console.error("Failed to fetch dependent info:", error);
            throw new Error(`An error occurred while fetching dependent info: ${error.message}`);
        }
    },
    getJobTitleInfo: async (connection, data) => {
        console.log("___getJobTitleInfo: Fetching job title info for EmployeeID:", data.EmployeeID);
        const sqlQuery = `
            SELECT 
                jobtitle.JobTitleName 
            FROM 
                jobtitle 
            JOIN 
                employee ON employee.JobTitleID = jobtitle.JobTitleID 
            WHERE 
                employee.EmployeeID = ?
        `;
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return results;
        } catch (error) {
            console.error("Failed to fetch job title info:", error);
            throw new Error(`An error occurred while fetching job title info: ${error.message}`);
        }
    },
    getDepartmentInfo: async (connection, data) => {
        console.log("___getDepartmentInfo: Fetching department info for EmployeeID:", data.EmployeeID);
        const sqlQuery = `
            SELECT 
                DepartmentName 
            FROM 
                department 
            JOIN 
                employee ON department.DepartmentID = employee.DepartmentID 
            WHERE 
                employee.EmployeeID = ?
        `;
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return results;
        } catch (error) {
            console.error("Failed to fetch department info:", error);
            throw new Error(`An error occurred while fetching department info: ${error.message}`);
        }
    },
    getSupervisorsInfo: async (connection, data) => {
        console.log("___getSupervisorsInfo: Fetching supervisor info for EmployeeID:", data.EmployeeID);

        const sqlQuery = `
            SELECT 
                supervisor.EmployeeName AS SupervisorName, 
                supervisor.EmployeeID AS SupervisorID 
            FROM 
                employee AS e
            JOIN 
                employee AS supervisor ON e.SupervisorID = supervisor.EmployeeID
            WHERE 
                e.EmployeeID = ?
        `;

        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return results[0];  // Assuming an employee has only one supervisor.
        } catch (error) {
            console.error("Failed to fetch supervisor info:", error);
            throw new Error(`An error occurred while fetching supervisor info: ${error.message}`);
        }
    },
    getEmployeeStatusInfo: async (connection, data) => {
        console.log("___getEmployeeStatusInfo: Fetching employee status info for EmployeeID:", data.EmployeeID);
        const sqlQuery = `
            SELECT 
                EmploymentStatusName 
            FROM 
                employmentstatus 
            JOIN 
                employee ON employee.EmploymentStatusID = employmentstatus.EmploymentStatusID 
            WHERE 
                employee.EmployeeID = ?
        `;
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return results;
        } catch (error) {
            console.error("Failed to fetch employee status info:", error);
            throw new Error(`An error occurred while fetching employee status info: ${error.message}`);
        }
    },
    getPayGradesInfo: async (connection, data) => {
        console.log("___getPayGradesInfo: Fetching paygrade info for EmployeeID:", data.EmployeeID);
        const sqlQuery = `
            SELECT 
                PayGradeName 
            FROM 
                paygrade 
            JOIN 
                employee ON employee.PayGradeID = paygrade.PayGradeID 
            WHERE 
                employee.EmployeeID = ?
        `;
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return results;
        } catch (error) {
            console.error("Failed to fetch paygrade info:", error);
            throw new Error(`An error occurred while fetching paygrade info: ${error.message}`);
        }
    },
    getEmergencyInfo: async (connection, data) => {
        console.log('___getEmergencyInfo: Fetching emergency info for EmployeeID:', data.EmployeeID);
        const sqlQuery = `
            SELECT 
                emergencycontact.PrimaryName,
                emergencycontact.PrimaryPhoneNumber,
                emergencycontact.SecondaryName,
                emergencycontact.SecondaryPhoneNumber,
                emergencycontact.Address 
            FROM 
                emergencycontact 
            JOIN 
                employee ON emergencycontact.EmergencyContactID = employee.EmergencyContactID
            WHERE 
                employee.EmployeeID = ?
        `;
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return results;
        } catch (error) {
            console.error("Failed to fetch emergency info:", error);
            throw new Error(`An error occurred while fetching emergency info: ${error.message}`);
        }
    },
    getCustomAttributesInfo: async (connection, data) => {
        console.log("___getCustomAttributesInfo")
        const sqlQuery = `
            SELECT
                AttributeName,AttributeValue
            FROM 
                employeecustomattributes
            WHERE
                employeecustomattributes.EmployeeID =?`
        try {
            const [results] = await connection.query(sqlQuery, [data.EmployeeID]);
            if (results.length == 0) {
                return null;
            }
            return results;
        } catch (error) {
            console.log("Failed to fetch employeecustomattributes info:", error);
            throw new Error(`An error occurred while fetching employeecustomattributes info: ${error.message}`);
        }
    },
    fetchNotApprovedLeaves: async (connection) => {
        console.log("___fetchNotApprovedLeaves")
        const sqlQuery = `
            SELECT
                *
            FROM
                \`leave\`
            WHERE 
                Approved=0
        `;
        try {
            const [results] = await connection.query(sqlQuery);
            if (results.length == 0) {
                return null;
            }
            return results;
        } catch (error) {
            console.error("Failed to fetch leave info:", error);
            throw new Error(`An error occurred while fetching leave info: ${error.message}`);
        }
    },
    updateLeaves: async (connection, data) => {
        console.log("___updateLeaves");
        // console.log(data);
        try {
            const [result] = await connection.execute(
                `UPDATE \`leave\`
                SET \`Approved\` = 1, \`ApprovedByID\` = ?,ApprovedDateTime=?
                WHERE \`EmployeeID\` = ? AND LeaveID=?`,
                [data.ApprovedByID, data.ApprovedDateTime, data.EmployeeID, data.LeaveID]
            );
            return result;
        } catch (error) {
            console.error("Error updating leaves:", error.message);
            throw new Error(`An error occurred while updating leaves: ${error.message}`);
        }
    },
    updateLeaveForDenyReq: async (connection, data) => {
        console.log('___updateLeaveForDenyReq');
        try {
            const result = await connection.execute(
                `UPDATE \`leave\`
                SET Approved=-1, ApprovedByID=?, ApprovedDateTime=?
                WHERE EmployeeID=? AND LeaveID=?`,
                [data.ApprovedByID, data.ApprovedDateTime, data.EmployeeID, data.LeaveID]
            );
            return result;
        } catch (error) {
            console.error("Error in updateLeaveForDenyReq:", error.message);
            throw new Error(`An error occurred in updateLeaveForDenyReq: ${error.message}`);
        }
    },
    getSupervisees: async (connection, EmployeeID) => {
        console.log("___getSupervisees");
        try {
            const [supervisees] = await connection.query(
                `SELECT employee.EmployeeID,EmployeeName,DateOfBirth,Gender,MaritalStatus,employee.Address,Country,DepartmentName,JobTitleName,PayGradeID,EmploymentStatusID,SupervisorID,UserID,Username,Email,useraccount.UserAccountLevelID,UserAccountLevelName,PrimaryName,PrimaryPhoneNumber,SecondaryName,SecondaryPhoneNumber,emergencycontact.Address as EmergencyAddress
                FROM employee 
                JOIN department ON employee.DepartmentID = department.DepartmentID
                JOIN jobtitle ON jobtitle.JobTitleID = employee.JobTitleID
                JOIN useraccount ON useraccount.EmployeeID = employee.EmployeeID
                JOIN useraccountlevel ON useraccount.userAccountLevelID = userAccountLevel.userAccountLevelID
                JOIN emergencycontact ON emergencycontact.EmergencyContactID=employee.EmergencyContactID
                WHERE employee.SupervisorID = ?`, [EmployeeID]
            );

            // Early exit if there are no supervisees
            if (supervisees.length === 0) {
                return null;
            }

            // Create an array of promises for the custom attributes queries
            const customAttributesPromises = supervisees.map(supervisee =>
                connection.query(
                    `SELECT AttributeName, AttributeValue
                    FROM employeecustomattributes
                    WHERE EmployeeID = ?`, [supervisee.EmployeeID]
                ).then(([customAttributes]) => {
                    // Assign the custom attributes directly to the supervisee object
                    supervisee.CustomAttributes = customAttributes;
                })
            );

            // Wait for all the custom attributes promises to resolve
            await Promise.all(customAttributesPromises);

            return supervisees;
        } catch (error) {
            console.error("Error getting supervisees:", error.message);
            throw new Error(`An error occurred while getting supervisees: ${error.message}`);
        }
    },
    editUserCredentials: async (connection, data) => {
        console.log("___editUserCredentials");
        try {
            // Fetch existing hashed password for the provided email
            const [existingUser] = await connection.query(
                `SELECT PasswordHash FROM useraccount WHERE Email = ?`,
                [data.email]
            );
    
            if (existingUser.length == 0) {
                throw new Error('User not found');
            }
    
            // Compare provided old password with the stored hash
            const isPasswordMatch = await bcrypt.compare(data.oldPassword, existingUser[0].PasswordHash);
    
            if (!isPasswordMatch) {
                throw new Error('Old password does not match');
            }
    
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(data.newPassword, salt);
    
            // Update the password in the database
            const [results] = await connection.query(
                `UPDATE useraccount SET PasswordHash = ? WHERE Email = ?`,
                [hashedNewPassword, data.email]
            );
    
            console.log(results);
            return results;
    
        } catch (error) {
            console.error("Error editing user credentials:", error.message);
            throw new Error(`An error occurred while editing user credentials: ${error.message}`);
        }
    },    
    getEmployeeDetails: async (connection, EmployeeID) => { //done
        console.log("___getEmployeeDetails");
        console.log(EmployeeID)
        // console.log(EmployeeID)
        try {
            const [result] = await connection.query(`SELECT * FROM employee WHERE employee.EmployeeID=?`, [EmployeeID]);
            // console.log(result);
            return result;  // Return the fetched result
        } catch (error) {
            throw new Error(`An error occurred while fetching employee details: ${error.message}`);
        }
    },
    updateEmergencyContact: async (connection, data) => {//done update emergency contact
        console.log("___updateEmergencyContact");
        // console.log(data);
        try {
            const query = `UPDATE emergencycontact 
                            SET PrimaryName=?, PrimaryPhoneNumber=?, SecondaryName=?, SecondaryPhoneNumber=? 
                            WHERE EmergencyContactID=?`;
            const result = await connection.query(query, [data.name1, data.telNo1, data.name2, data.telNo2, data.EmergencyContactIDz]);
            return result;
        } catch (error) {
            throw new Error(`An error occurred while updating emergency contact: ${error.message}`);
        }
    },
    updateEmployee: async (connection, data) => { //done
        console.log("___updateEmployee");
        const {employeeData, userData, dependentInfo, emergencyInfo} = data
        try {
            const newData = await findIDs(employeeData);
            // console.log(newData);
            if (!newData.DepartmentID || !newData.JobTitleID || !newData.PayGradeID || !newData.EmploymentStatusID || typeof newData.SupervisorID === 'undefined') {
                throw new Error("Required ID(s) missing from newData");
            }

            // console.log(data);
            const [result] = await connection.execute('CALL UpdateEmployeeAndRelatedData( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    employeeData.EmployeeID,
                    employeeData.EmployeeName,
                    employeeData.DateOfBirth,
                    employeeData.Gender,
                    employeeData.MaritalStatus,
                    employeeData.Address,
                    employeeData.Country,
                    newData.DepartmentID,
                    newData.JobTitleID,
                    newData.PayGradeID,
                    newData.EmploymentStatusID,
                    newData.SupervisorID,
                    userData.UserID,
                    userData.Username,
                    userData.Email,
                    userData.UserAccountLevelID,
                    dependentInfo.DependentName,
                    dependentInfo.DependentAge,
                    emergencyInfo.name1,
                    emergencyInfo.telNo1,
                    emergencyInfo.name2,
                    emergencyInfo.telNo2,
                    emergencyInfo.emergencyAddress
                ]
            );
            return result;

        } catch (error) {
            console.error("Error in updateEmployee:", error.message);
            throw new Error(`An error occurred: ${error.message}`);
        }
    },
    getUserAccountLevelIDByUserAccountLevelName: async (connection, UserAccountLevelName) => { //done
        console.log("___getUserAccountLevelIDByUserAccountLevel");

        if (!UserAccountLevelName) {
            console.error("UserAccountLevelName is not provided");
            throw new Error("Required UserAccountLevelName missing");
        }
        try {
            const [result] = await connection.query(`SELECT UserAccountLevelID FROM UserAccountLevel WHERE UserAccountLevelName=?`, [UserAccountLevelName]);

            if (result && result.length > 0) {
                console.log("Successfully fetched UserAccountLevelID:", result[0].UserAccountLevelID);
                return result[0].UserAccountLevelID;
            } else {
                console.warn(`No UserAccountLevelID found for UserAccountLevelName: ${UserAccountLevelName}`);
                return null;
            }

        } catch (error) {
            console.error("Error in getUserAccountLevelIDByUserAccountLevelName:", error.message);
            throw new Error(`An error occurred in getUserAccountLevelIDByUserAccountLevelName: ${error.message}`);
        }
    },
    updateUser: async (connection, data) => { //done
        console.log("___updateUser");
        console.log(data);

        if (!data || !data.Username || !data.Email || !data.UserAccountLevelID || !data.UserID || !data.EmployeeID) {
            console.error("Required fields are missing in updateUser");
            throw new Error("Required fields are missing for updating the user.");
        }

        try {
            const query = `
                UPDATE useraccount
                SET
                    Username=?,
                    Email=?,
                    UserAccountLevelID=?
                WHERE
                    UserID=? AND EmployeeID=?
            `;
            const result = await connection.query(query, [data.Username, data.Email, data.UserAccountLevelID, data.UserID, data.EmployeeID]);

            // console.log("Update successful:", result);
            return result;
        } catch (error) {
            console.error("Error in updateUser:", error.message);
            throw new Error(`An error occurred in updateUser: ${error.message}`);
        }
    },
    updateDependent: async (connection, data) => { //done
        console.log("___updateDependent");
        // console.log(data);
        try {
            const queryForUpdateDependent = `
                UPDATE dependentInfo
                SET 
                    DependentName=?, 
                    DependentAge=?
                WHERE
                    EmployeeID=?
            `;
            const queryForAddDependent = `
                INSERT INTO dependentInfo(EmployeeID, DependentName, DependentAge)
                VALUES (?,?,?)
            `;

            var result = await connection.query(queryForUpdateDependent, [
                data.DependentName,
                data.DependentAge,
                data.EmployeeID
            ]);
            const match = result[0].info.match(/Rows matched: (\d+)/);
            const rowsMatched = match ? parseInt(match[1], 10) : 0;
            if (rowsMatched == 0) {
                result = await connection.query(queryForAddDependent, [
                    data.EmployeeID,
                    data.DependentName,
                    data.DependentAge
                ]);
            }
            console.log("Dependent info updated successfully for EmployeeID:", data.EmployeeID);
            return result;

        } catch (error) {
            console.error("Error in updateDependent:", error.message);
            throw new Error(`An error occurred in updateDependent: ${error.message}`);
        }
    },
    updateMyCustomAttributes: async (connection, data) => {
        console.log("___updateMyCustomAttributes")
        // console.log(data)
        const { EmployeeID, CustomAttributesInfo } = data;

        const results = [];
        for (const { AttributeName, AttributeValue } of CustomAttributesInfo) {
            // The query should be an UPDATE statement, not an INSERT statement.
            const query = `
                UPDATE EmployeeCustomAttributes
                SET AttributeValue = ?
                WHERE EmployeeID = ? AND AttributeName = ?;
            `;
            try {
                // Pass the parameters in the correct order as expected by the WHERE clause of the UPDATE statement
                const result = await connection.query(query, [AttributeValue, EmployeeID, AttributeName]);
                // console.log("Attribute updated successfully:", result);
                results.push({ AttributeName, success: true, result });
            } catch (error) {
                console.error("Error updating custom attribute:", error.message);
                // It's generally not a good idea to push error messages into the same array as your results,
                // Instead, you might want to have a more structured error handling strategy.
                results.push({ AttributeName, success: false, errorMessage: error.message });
            }
        }
        return results;
    },
    addNewCustomAttributeForEmployee: async (connection, data) => {
        console.log("___addNewCustomAttributeForEmployee");
        // console.log(data);

        const { EmployeeID, CustomAttributesInfo } = data;

        const results = [];

        for (const { AttributeName, AttributeValue } of CustomAttributesInfo) {
            const query = `
            INSERT INTO EmployeeCustomAttributes (EmployeeID, AttributeName, AttributeValue)
            VALUES (?, ?, ?);
            `;
            try {
                const result = await connection.query(query, [EmployeeID, AttributeName, AttributeValue]);
                // console.log("Attribute added successfully:", result);
                results.push(result);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.error(`Duplicate entry for ${AttributeName} and employee ID ${EmployeeID}:`, error.message);
                } else {
                    console.error("Error adding new custom attribute:", error.message);
                }
                // Depending on the requirements, you might want to stop the loop and throw an error
                // or you might just log the error and continue with the next attribute
                // For now, let's log and continue
            }
        }

        // Return all results, including any errors that were caught.
        return results;
    },
}