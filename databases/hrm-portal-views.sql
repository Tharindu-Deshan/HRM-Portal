-- DROP VIEW EmployeeByDepartment ;
-- DROP VIEW EmployeeByJobtitle ;
-- DROP VIEW EmployeeByPaygrade ;

CREATE VIEW EmployeeByDepartment AS
SELECT d.DepartmentName,COUNT(*) AS EmployeeCount
FROM employee e 
JOIN department d ON e.DepartmentID=d.DepartmentID
GROUP BY d.DepartmentName;

CREATE VIEW EmployeeByJobtitle AS
SELECT j.JobTitleName,COUNT(*) AS EmployeeCount
FROM employee e
JOIN jobtitle j ON e.JobTitleID =j.JobTitleID
GROUP BY JobTitleName;

CREATE VIEW EmployeeByPaygrade AS
SELECT p.PayGradeName,COUNT(*) AS EmployeeCount
FROM employee e
JOIN paygrade p ON e.PayGradeID =p.PayGradeID
GROUP BY PayGradeName;

-- DROP VIEW EmployeeDetailsView ;
CREATE VIEW `EmployeeDetailsView` AS
SELECT 
    e.`EmployeeID`,
    e.`EmployeeName`,
    e.`DateOfBirth`,
    e.`Gender`,
    e.`MaritalStatus`,
    e.`Address`,
    e.`Country`,
    d.`DepartmentName`,
    jt.`JobTitleName`,
    pg.`PayGradeName`,
    es.`EmploymentStatusName`,
    e.`SupervisorID`,
    (SELECT emp2.EmployeeName FROM Employee emp2 WHERE emp2.EmployeeID = e.`SupervisorID`) AS `SupervisorName`,
    ua.`Username` AS `UserAccountUsername`,
    ua.`Email` AS `UserAccountEmail`
FROM 
    `Employee` e
    LEFT JOIN `Department` d ON e.`DepartmentID` = d.`DepartmentID`
    LEFT JOIN `JobTitle` jt ON e.`JobTitleID` = jt.`JobTitleID`
    LEFT JOIN `PayGrade` pg ON e.`PayGradeID` = pg.`PayGradeID`
    LEFT JOIN `EmploymentStatus` es ON e.`EmploymentStatusID` = es.`EmploymentStatusID`
    LEFT JOIN `UserAccount` ua ON e.`EmployeeID` = ua.`EmployeeID`;

