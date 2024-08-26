const pool = require('../../db/database');
const bcrypt = require('bcrypt');

const {
    create,
    getUserByUserID,
    getUserss,
    deleteUser,
    getUserByUserEmail,
    addEmployee,
    addUser,
    addEmergencyContact,
    getSupervisors,
    getDepartments,
    getJobTitles,
    getCountries,
    getEmployeeStatus,
    getPayGrades,
    getCustomAttributes,

    addDependent,

    addNewColumnForEmployee,
    addNewCustomAttributeForEmployee,

    getLastUserID,
    getLastEmployeeID,
    reqLeave,
    getEmployeeIDByUserID,
    getUserIDByEmployeeID,
    getUserIDAndUserAccountLvIDByEmployeeID,

    getUserAccountLevelByUserID,
    getPersonalInfo,
    getDependentInfo,
    getJobTitleInfo,
    getDepartmentInfo,
    getSupervisorsInfo,
    getEmployeeStatusInfo,
    getPayGradesInfo,
    getEmergencyInfo,
    getCustomAttributesInfo,

    editUserCredentials,

    getEmployeeDetails,
    updateEmergencyContact,
    updateEmployee,
    getUserAccountLevelIDByUserAccountLevelName,
    updateUser,
    updateDependent,
    updateMyCustomAttributes,

    getTotTakenLeaveCount,
    getTotApprovedLeaveCount,
    getTotApprovedLeaveCountByType,

    fetchNotApprovedLeaves,
    updateLeaves,
    updateLeaveForDenyReq,

    getSupervisees,
    // updateDependentSupervisees
} = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

// Helper function for sending error response
const sendErrorResponse = (res, message) => {
    return res.status(500).json({
        success: 0,
        message,
    });
};

module.exports = {
    homeSub: async (req, res) => {
        console.log('> HomeSub');
        const data = req.body
        // console.log(data)
        let connection;
        try {
            connection = await pool.getConnection();

            // If you have multiple asynchronous tasks, you can add them in Promise.all
            const [
                PersonalInfo,
                EmployeeStatusInfo,
                PayGradesInfo,
                TotApprovedLeaveCount,
                TotApprovedLeaveCountByType,
            ] = await Promise.all([
                getPersonalInfo(connection, data),
                getEmployeeStatusInfo(connection, data),
                getPayGradesInfo(connection, data),
                getTotApprovedLeaveCount(connection, data),
                getTotApprovedLeaveCountByType(connection, data)
            ]);
            // console.log(PersonalInfo)
            const PersonalInfoForHome = {
                EmployeeID: PersonalInfo.personalInfo.EmployeeID,
                CountryID: PersonalInfo.personalInfo.CountryID,
                Username: PersonalInfo.personalInfo.Username,
                Gender: PersonalInfo.personalInfo.Gender,
            }
            return res.json({
                success: 1,
                message: "success",
                PersonalInfoForHome,
                EmployeeStatusInfo,
                PayGradesInfo,
                TotApprovedLeaveCount,
                TotApprovedLeaveCountByType
            });
        } catch (error) {
            console.error("Error in homeSub:", error.message);
            return res.status(500).json({
                success: 0,
                message: "Internal Server Error"
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
    login: async (req, res) => {   //login to the system - done
        console.log("> Login to system")

        const data = req.body;
        // console.log(data)
        try {
            const { email, password } = req.body;
            // console.log(email)
            console.log(password)
            const results = await getUserByUserEmail(email);
            // console.log(results)
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password",
                });
            }
            const isValidPassword1 = compareSync(password, results[0].PasswordHash);
            const isValidPassword2 = data.password == results[0].PasswordHash ? true : false;
            if (isValidPassword1 || isValidPassword2) {
                // Token generation and response sending logic
                results.PasswordHash = undefined;
                const jsontoken = sign({ result: results }, "qwe1234", {
                    expiresIn: "1h"
                });

                //required response
                const values = {
                    UserID: results[0].UserID,
                    EmployeeID: results[0].EmployeeID,
                    UserAccountLevelID: results[0].UserAccountLevelID
                };
                // console.log(values)
                console.log("   ___login successful\n<")
                return res.json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken,
                    values: values
                })

            } else {
                console.log("<")
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                })
            }
        } catch (err) {
            console.error(err);
            console.log("<")
            sendErrorResponse(res, "An error occurred during login");
        }
    },
    register: async (req, res) => { // Registration - done
        console.log("> Register");
        const body = req.body;
        console.log(body);
        let connection;
        try {
            //Get a connection from the pool
            connection = await pool.getConnection();

            //Start transaction
            await connection.beginTransaction();

            // Add emergency contact
            // const emergencyResult = await addEmergencyContact(connection, body.emergencyInfo);
            // const EmergencyContactID = emergencyResult.EmergencyContactID;

            const lastUserIDResult = await getLastUserID(connection); //get UserID of last Added user
            // console.log(lastUserIDResult)
            var UserID = parseInt(lastUserIDResult[0]['UserID']) + 1;
            // console.log(lastUserID)
            const lastEmployeeResult = await getLastEmployeeID(connection); //get Last Employee ID of last Added employee
            var EmployeeID = lastEmployeeResult[0]['EmployeeID'];
            // console.log(EmployeeID);

            const parts = EmployeeID.split('-');
            var integerPart = parseInt(parts[1]);
            integerPart++;
            integerPart = integerPart.toString().padStart(4, '0');
            var EmployeeID = parts[0] + '-' + integerPart;

            // console.log(EmployeeID);
            const salt = await bcrypt.genSalt(10);
            const PasswordHash = await bcrypt.hash("9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0", salt);

            // Prepare data for registration
            let employeeData = {
                "UserID": UserID,
                "Username": body.personalInfo.username,
                "Email": body.personalInfo.email,
                // "PasswordHash": "0000", //default password
                // "PasswordHash": "9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0", //default password
                "PasswordHash": PasswordHash, //default password
                "UserAccountLevelID": body.personalInfo.userAccountType,

                "EmployeeID": EmployeeID,
                "EmployeeName": body.personalInfo.name,
                "DateOfBirth": body.personalInfo.dob,
                "Gender": body.personalInfo.gender,
                "MaritalStatus": body.personalInfo.maritalStatus,

                "Address": body.personalInfo.address,
                "Country": body.personalInfo.country,
                "DepartmentID": body.departmentInfo.department,
                "JobTitleID": body.departmentInfo.jobTitle,
                "PayGradeID": body.departmentInfo.payGrade,
                "EmploymentStatusID": body.departmentInfo.status,
                "SupervisorID": body.departmentInfo.supervisor
            }
            let dependentInfo = {
                "EmployeeID": employeeData.EmployeeID,
                "DependentName": body.personalInfo.dependentName,
                "DependentAge": body.personalInfo.dependentAge == '' ? 0 : body.personalInfo.dependentAge
            }
            let customAttributes = {
                "EmployeeID": employeeData.EmployeeID,
                "CustomAttributesInfo": body.CustomAttributes
            }
            //Hash password
            // const salt = genSaltSync(10);
            // body.PasswordHash = hashSync(body.PasswordHash, salt);
            // console.log(body.PasswordHash)

            // const salt = await bcrypt.genSalt(10);
            // const passwordHash = await bcrypt.hash("9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0", salt); // ensure you get the password from the correct part of the body
            // console.log(passwordHash)
            // data.PasswordHash = passwordHash;

            // const
            //Add employee
            const emergencyInfo = body.emergencyInfo;

            const employeeResult = await addEmployee(connection, {employeeData, dependentInfo, emergencyInfo});
            //Add user
            // const userResult = await addUser(connection, data);
            //Add dependent
            // const dependentResult = await addDependent(connection, dependentInfo);

            const customAttributeResult = await addNewCustomAttributeForEmployee(connection, customAttributes);

            //Commit transaction
            await connection.commit();

            console.log("<")
            return res.json({
                success: 1,
                data: {
                    // user: userResult,
                    employee: employeeResult,
                    // dependentResult: dependentResult,
                    customAttributeResult: customAttributeResult,
                },
                message: "Registration successful",
            })

        } catch (error) {
            //Rollback the transaction if any query fails
            if (connection) {
                await connection.rollback();
            }
            console.log(error)
            if(error == "Error: Duplicate email detected!"){
                return res.status(500).json({
                    success: -1,
                    message: "Duplicate email detected!",
                });
            }

            console.log("<")
            return res.status(500).json({
                success: 0,
                message: "An error occurred during registration",
            });
        } finally {
            console.log("<")
            if (connection) {
                connection.release();
            }
        }
    },
    getRegisterSub: async (req, res) => { //done
        console.log("> getRegisterSub")
        try {
            const [
                departments,
                supervisors,
                jobTitles,
                countries,
                EmployeeStatuses,
                PayGrades,
                CustomAttributes,
            ] = await Promise.all([
                getDepartments(),
                getSupervisors(),
                getJobTitles(),
                getCountries(),
                getEmployeeStatus(),
                getPayGrades(),
                getCustomAttributes(),
            ]);
            console.log('<')
            return res.json({
                departments,
                supervisors,
                jobTitles,
                countries,
                EmployeeStatuses,
                PayGrades,
                CustomAttributes
            });
        } catch (error) {
            console.error("Actual error:", error); // Log the actual error
            return res.status(500).json({
                error: "An error occurred while fetching registration data"
            });
        }
    },
    addCustomAttribute: async (req, res) => {
        console.log("> addCustomAttribute")

        if (!req.body.EmployeeID || !req.body.CustomAttributes) {
            return res.status(400).json({ error: 'Required data NOT FOUND!.' });
        }
        let connection;
        try {
            connection = await pool.getConnection();

            const [result] = await addNewCustomAttributeForEmployee(connection, req.body);

            return res.status(200).json({ message: 'CustomAttributes added successfully!', result });
        } catch (error) {
            console.error('Error while adding custom attribute:', error.message);
            return res.status(500).json({ error: `Failed to add custom attribute. Details: ${error.message}` });
        } finally {
            console.log("<")
            if (connection) {
                connection.release();
            }
        }
    },
    myAccount: async (req, res) => {
        console.log(">myAccount");
        // console.log(req.body);
        const data = req.body;
        console.log(data)
        let connection;
        try {
            connection = await pool.getConnection();

            const [
                UserAccountLv,
                PersonalInfo,
                DependentInfo,

                JobTitleInfo,
                DepartmentInfo,
                SupervisorsInfo,
                EmployeeStatusInfo,
                PayGradesInfo,

                EmergencyInfo,
                CustomAttributesInfo,

            ] = await Promise.all([
                getUserAccountLevelByUserID(connection, data),

                getPersonalInfo(connection, data),
                getDependentInfo(connection, data),

                getJobTitleInfo(connection, data),
                getDepartmentInfo(connection, data),
                getSupervisorsInfo(connection, data),
                getEmployeeStatusInfo(connection, data),
                getPayGradesInfo(connection, data),

                getEmergencyInfo(connection, data),
                getCustomAttributesInfo(connection, data)
            ]);
            return res.json({
                success: 1,
                message: "My account accessed successfully",
                UserAccountLv,
                PersonalInfo,
                DependentInfo,
                JobTitleInfo,
                DepartmentInfo,
                SupervisorsInfo,
                EmployeeStatusInfo,
                PayGradesInfo,
                EmergencyInfo,
                CustomAttributesInfo

            });

        } catch (error) {
            console.error("An error occurred while accessing my account:", error);
            return res.status(500).json({
                success: 0,
                message: `An error occurred while accessing my account: ${error.message}`
            });
        } finally {
            console.log("<")
            if (connection) connection.release();
        }
    },
    editMyAccount: async (req, res) => {
        console.log("> editMyAccount");
        const body = req.body;
        console.log(body)
        let connection;
        try {
            //Get a connection from the pool
            connection = await pool.getConnection();

            //Start transaction
            await connection.beginTransaction();
            // const employeeDetails = await getEmployeeDetails(connection, body.personalInfo.employeeID);

            //update the emegency information
            // body.emergencyInfo.EmergencyContactID = employeeDetails[0].EmergencyContactID;
            // const emergencyResult = await updateEmergencyContact(connection, body.emergencyInfo);

            const UserIDAndUserAccountLvID = await getUserIDAndUserAccountLvIDByEmployeeID(connection, body.personalInfo.employeeID);
            // Prepare data for update employee information
            employeeData = {
                "EmployeeID": body.personalInfo.employeeID,
                "EmployeeName": body.personalInfo.name,
                "DateOfBirth": body.personalInfo.dob,
                "Gender": body.personalInfo.gender,
                "MaritalStatus": body.personalInfo.maritalStatus,

                "Address": body.personalInfo.address,
                "Country": body.personalInfo.country,
                "DepartmentID": body.departmentInfo.department,
                "JobTitleID": body.departmentInfo.jobTitle,
                "PayGradeID": body.departmentInfo.payGrade,
                "EmploymentStatusID": body.departmentInfo.status,
                "SupervisorID": body.departmentInfo.supervisor,
            }
            userData = {
                "UserID": body.personalInfo.UserID,
                "EmployeeID": body.personalInfo.employeeID,
                "Username": body.personalInfo.username,
                "Email": body.personalInfo.email,
                // "PasswordHash": "0000", //default password
                "UserAccountLevelName": body.personalInfo.userAccountType,
                "UserAccountLevelID":UserIDAndUserAccountLvID[0].UserAccountLevelID
                
            }
            dependentInfo = {
                "EmployeeID": employeeData.EmployeeID,
                "DependentName": body.personalInfo.dependentName,
                "DependentAge": body.personalInfo.dependentAge
            }
            customAttributes = {
                "EmployeeID": employeeData.EmployeeID,
                "CustomAttributesInfo": body.CustomAttributesInfo
            }
            newlyAddedCustomAttributesInfo = {
                "EmployeeID": employeeData.EmployeeID,
                "CustomAttributesInfo": body.newlyAddedCustomAttributesInfo
            }
            // const UserAccountLevelID = await getUserAccountLevelIDByUserAccountLevelName(connection, userData.UserAccountLevelName);
            
            const emergencyInfo = body.emergencyInfo;

            // const employeeResult = await updateEmployee(connection, employeeData);//update employee --old one
            // userData.UserAccountLevelID = UserAccountLevelID;
            const employeeResult = await updateEmployee(connection, {employeeData, userData, dependentInfo, emergencyInfo});//update employee
            // const userResult = await updateUser(connection, userData);//update user

            // const dependentResult = await updateDependent(connection, dependentInfo);//update dependent

            const customAttributesResult = await updateMyCustomAttributes(connection, customAttributes);//update my custom attributes
            const newlyAddedcustomAttributesResult = await addNewCustomAttributeForEmployee(connection, newlyAddedCustomAttributesInfo);//add new custom attributes

            // console.log(customAttributes)

            //Commit transaction
            await connection.commit();

            console.log("<")
            return res.json({
                success: 1,
                data: {
                    // user: userResult,
                    employee: employeeResult,
                    // dependentResult: dependentResult,
                    // emergencyResult: emergencyResult,
                    customAttributesResult: customAttributesResult,
                    newlyAddedcustomAttributesResult: newlyAddedcustomAttributesResult
                },
                message: "Edit employee successful",
            })

        } catch (error) {
            //Rollback the transaction if any query fails
            if (connection) {
                await connection.rollback();
            }
            console.log(error)
            console.log("<")
            return res.status(500).json({
                success: 0,
                message: "An error occurred during Edit employee",
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
    createUser: (req, res) => {
        const body = req.body;
        console.log(body.PasswordHash);
        console.log(body);
        try {
            const salt = genSaltSync(10);
            body.PasswordHash = hashSync(body.PasswordHash, salt);
        } catch (error) {
            console.log('Error while hasing the password', error);
        }
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database Connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },
    getUserByUserID: (req, res) => {
        const userID = req.params.id;
        getUserByUserID(userID, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                });
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    getUsers: async (req, res) => {
        console.log(">getUsers")
        try {
            const results = await getUserss();
            return res.json({
                results
            });
        } catch (error) {
            console.error("Actual error:", error); // Log the actual error
            return res.status(500).json({
                error: "An error occurred while fetching users"
            });
        }
    },
    updateUsers: (req, res) => {
        const body = req.body;
        try {
            const salt = genSaltSync(10);
            body.PasswordHash = hashSync(body.PasswordHash, salt);
        } catch (error) {
            console.log('Error whilte hasing the password', error);
        }
        updateUser(body, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Failed to update users"
                })
            }
            return res.json({
                success: 1,
                message: "update successfully"
            })
        })
    },
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!result) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                })
            }
            return res.json({
                success: 1,
                message: "user delected successfully"
            })
        })
    },
    getReqLeaveSub: async (req, res) => {
        console.log(">getReqLeaveSub");
        // console.log(req.body)
        const userID = req.body['userID']
        // console.log(userID)
        try {
            const totLeaveCountArray = await getTotTakenLeaveCount(userID);
            const totLeaveCount = totLeaveCountArray[0]["totLeaveCount"];

            // Construct the result object
            const result = {
                totTakenApprovedLeaveCount: totLeaveCount
            };
            // console.log(result);
            return res.json({
                success: 1,
                result
            });
        } catch (error) {
            console.error("Actual error:", error);
            return res.status(500).json({
                error: "An error occurred while fetching leave count"
            });
        }
    },
    reqALeave: async (req, res) => { //done
        console.log(">reqALeave")
        const data = req.body;
        // console.log(data)
        try {
            // console.log(data['UserID']);
            // const EmployeeID = await getEmployeeIDByUserID(data['UserID']);
            // data["EmployeeID"]=EmployeeID
            console.log(data)
            const result = await reqLeave(data);
            // console.log(result);
            console.log("<");
            return res.status(200).json({
                success: 1,
                result: result
            })
        } catch (err) {
            console.log("<")
            return res.json({
                success: 0,
                message: err.message
            })
        }
    },
    getNotApprovedLeaves: async (req, res) => {
        console.log("> Entering getNotApprovedLeaves");

        let connection;
        try {
            connection = await pool.getConnection();

            // Assuming the actual database function is called fetchNotApprovedLeaves
            const result = await fetchNotApprovedLeaves(connection);

            for (let leave of result) {
                let data = { "EmployeeID": leave.EmployeeID };

                const [
                    PersonalInfo,
                    JobTitleInfo,
                    DepartmentInfo,
                    PayGradesInfo,
                    TotApprovedLeaveCount
                ] = await Promise.all([
                    getPersonalInfo(connection, data),
                    getJobTitleInfo(connection, data),
                    getDepartmentInfo(connection, data),
                    getPayGradesInfo(connection, data),
                    getTotApprovedLeaveCount(connection, data)
                ]);

                // console.log(PersonalInfo);
                // console.log(JobTitleInfo);
                // console.log(DepartmentInfo);
                // console.log(PayGradesInfo);
                // console.log(TotApprovedLeaveCount)

                leave.EmployeeName = PersonalInfo.personalInfo["EmployeeName"];
                leave.JobTitleName = JobTitleInfo[0]["JobTitleName"];
                leave.DepartmentName = DepartmentInfo[0]["DepartmentName"];
                leave.PayGradeName = PayGradesInfo[0]["PayGradeName"];
                leave.TotApprovedLeaveCount = TotApprovedLeaveCount[0]["totApprovedLeaveCount"]
            }

            // console.log(result);  // This will display the updated leaveData with the new status attribute for each leave

            console.log("< Exiting getNotApprovedLeaves with success");

            return res.status(200).json({
                success: 1,
                result: result
            });

        } catch (err) {
            console.error("< Exiting getNotApprovedLeaves with error:", err.message);

            return res.status(500).json({  // Use 500 or an appropriate error code
                success: 0,
                message: err.message
            });

        } finally {
            // Ensure that the connection is always released
            if (connection) {
                connection.release();
            }
        }
    },
    approveLeaves: async (req, res) => {
        console.log("> ApproveLeaves")
        let connection;
        try {
            connection = await pool.getConnection();
            const result = await updateLeaves(connection, req.body);
            return res.status(200).json({
                success: 1,
                result: result
            });
        } catch (error) {
            return res.status(500).json({
                success: 0,
                message: error.message
            });
        } finally {
            if (connection)
                connection.release();
        }
    },
    denyLeaves: async (req, res) => {
        console.log("> denyLeaves");
        let connection;
        try {
            connection = await pool.getConnection();
            const result = await updateLeaveForDenyReq(connection, req.body);

            // Send a success response to the client
            res.status(200).json({
                success: 1,
                message: "Leave has been successfully denied.",
                result: result
            });
        } catch (error) {
            // Handle the error and send an error response
            console.error("Error in denyLeaves:", error.message);
            res.status(500).json({  // Use 500 or an appropriate error code
                success: 0,
                message: `An error occurred: ${error.message}`
            });
        } finally {
            // Ensure the connection is released
            console.log("<")
            if (connection) {
                connection.release();
            }
        }
    },
    supervisees: async (req, res) => {
        console.log("> supervisees")
        let connection;
        // console.log(req.body.EmployeeID)
        try {
            connection = await pool.getConnection();
            const result = await getSupervisees(connection, req.body.EmployeeID);
            // console.log(result)
            // const UerID=await get
            return res.status(200).json({
                success: 1,
                supervisees: result
            });
        } catch (error) {
            return res.status(500).json({
                success: 0,
                message: error.message
            });
        } finally {
            console.log('<')
            if (connection)
                connection.release();
        }
    },
    editSupervisees: async (req, res) => {
        console.log("> editSupervisees");
        const body = req.body;
        console.log(body)
        let connection;
        try {
            //Get a connection from the pool
            connection = await pool.getConnection();

            //Start transaction
            await connection.beginTransaction();
            const UserIDAndUserAccountLvID = await getUserIDAndUserAccountLvIDByEmployeeID(connection, body.personalInfo.employeeID);

            // const employeeDetails = await getEmployeeDetails(connection, body.personalInfo.employeeID);

            //update the emegency information
            // body.emergencyInfo.EmergencyContactID = employeeDetails[0].EmergencyContactID;
            // const emergencyResult = await updateEmergencyContact(connection, body.emergencyInfo);

            // Prepare data for update employee information
            let employeeData = {
                "EmployeeID": body.personalInfo.employeeID,
                "EmployeeName": body.personalInfo.name,
                "DateOfBirth": body.personalInfo.dob,
                "Gender": body.personalInfo.gender,
                "MaritalStatus": body.personalInfo.maritalStatus,

                "Address": body.personalInfo.address,
                "Country": body.personalInfo.country,
                "DepartmentID": body.departmentInfo.department,
                "JobTitleID": body.departmentInfo.jobTitle,
                "PayGradeID": body.departmentInfo.payGrade,
                "EmploymentStatusID": body.departmentInfo.status,
                "SupervisorID": body.departmentInfo.supervisor,
            }
            let userData = {
                "UserID": UserIDAndUserAccountLvID[0].UserID,//body.personalInfo.UserID,
                "EmployeeID": body.personalInfo.employeeID,
                "Username": body.personalInfo.username,
                "Email": body.personalInfo.email,
                // "PasswordHash": "0000", //default password
                "UserAccountLevelID":UserIDAndUserAccountLvID[0].UserAccountLevelID
                // "UserAccountLevelID": body.personalInfo.UserAccountLevelID
            }
            let dependentInfo = {
                "EmployeeID": employeeData.EmployeeID,
                "DependentName": body.personalInfo.dependentName,
                "DependentAge": body.personalInfo.dependentAge = '' ? 0 : body.personalInfo.dependentAge
            }
            let customAttributes = {
                "EmployeeID": employeeData.EmployeeID,
                "CustomAttributesInfo": body.CustomAttributesInfo
            }
            let newlyAddedCustomAttributesInfo = {
                "EmployeeID": employeeData.EmployeeID,
                "CustomAttributesInfo": body.newlyAddedCustomAttributesInfo

            }

            const emergencyInfo = body.emergencyInfo;

            const employeeResult = await updateEmployee(connection, {employeeData, userData, dependentInfo, emergencyInfo});//update employee

            // const userResult = await updateUser(connection, userData);//update user

            // const dependentResult = await updateDependent(connection, dependentInfo);//update dependent

            const customAttributesResult = await updateMyCustomAttributes(connection, customAttributes);//update my custom attributes

            const newlyAddedcustomAttributesResult = await addNewCustomAttributeForEmployee(connection, newlyAddedCustomAttributesInfo);//add new custom attributes

            //Commit transaction
            await connection.commit();

            console.log("<")
            return res.json({
                success: 1,
                data: {
                    // user: userResult,
                    employee: employeeResult,
                    // dependentResult: dependentResult,
                    // emergencyResult: emergencyResult,
                    customAttributesResult: customAttributesResult,
                    newlyAddedcustomAttributesResult: newlyAddedcustomAttributesResult
                },
                message: "Edit employee successful",
            })

        } catch (error) {
            //Rollback the transaction if any query fails
            if (connection) {
                await connection.rollback();
            }
            console.log(error)
            console.log("<")
            return res.status(500).json({
                success: 0,
                message: "An error occurred during Edit employee",
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
    editUserCredentials: async (req, res) => {
        console.log("> editUserCredentials")
        let connection;
        try {
            connection = await pool.getConnection();
            const result = await editUserCredentials(connection, req.body);
            connection.release();
            return res.status(200).json({
                success: 1,
                result: result
            });

        } catch (error) {
            return res.status(500).json({
                success: 0,
                message: error.message
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

}