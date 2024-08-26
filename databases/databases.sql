-- Create schema hrm-portal;
-- -------------------------------------------------------------------------------
CREATE TABLE `Organization` (
  `OrganizationID` NUMERIC(10,0),
  `Name` VARCHAR(20),
  `Address` VARCHAR(50),
  `RegistrationNumber` VARCHAR(10),
  PRIMARY KEY (`OrganizationID`)
);
CREATE TABLE `Country` (
  `CountryID` NUMERIC(10,0), 
  `CountryName` VARCHAR(20),
  PRIMARY KEY (`CountryID`)
);
CREATE TABLE `Branch` (
  `BranchID` NUMERIC(10,0), 
  `BranchName` VARCHAR(20),
  `CountryID` NUMERIC(10,0),
  `OrganizationID` NUMERIC(10,0),
  PRIMARY KEY (`BranchID`),
  FOREIGN KEY (`OrganizationID`) REFERENCES `Organization`(`OrganizationID`),
  FOREIGN KEY (`CountryID`) REFERENCES `Country`(`CountryID`)
);
-- -------------------------------------------------------------------------------
CREATE TABLE `PayGrade` (
  `PayGradeID` NUMERIC(10,0),
  `PayGradeName` VARCHAR(20),
  `AnnualLeaveCount` NUMERIC(3,0),
  `CasualLeaveCount` NUMERIC(3,0),
  `MaternityLeaveCount` NUMERIC(3,0),
  `PayLeaveCount` NUMERIC(3,0),
  PRIMARY KEY (`PayGradeID`)
);
-- -------------------------------------------------------------------------------
CREATE TABLE `EmergencyContact` (
  `EmergencyContactID` NUMERIC(10,0),
  `PrimaryName` VARCHAR(20),
  `PrimaryPhoneNumber` NUMERIC(20,0),
  `SecondaryName` VARCHAR(50),
  `SecondaryPhoneNumber` NUMERIC(20,0),
  `Address` VARCHAR(100),
  PRIMARY KEY (`EmergencyContactID`)
);
CREATE TABLE `Department` (
  `DepartmentID` NUMERIC(10,0),
  `DepartmentName` VARCHAR(20),
  PRIMARY KEY (`DepartmentID`)
);
CREATE TABLE `JobTitle` (
  `JobTitleID` NUMERIC(10,0), 
  `JobTitleName` VARCHAR(20),
  PRIMARY KEY (`JobTitleID`)
);
CREATE TABLE `EmploymentStatus` (
  `EmploymentStatusID` NUMERIC(10,0),
  `EmploymentStatusName` VARCHAR(20),
  PRIMARY KEY (`EmploymentStatusID`)
);
CREATE TABLE `Employee` (
  `EmployeeID` NUMERIC(10,0),  
  `EmployeeName` VARCHAR(20),
  `DateOfBirth` DATE,
  `Gender` ENUM('Male','Female'),
  `MaritalStatus` ENUM('Married','Unmarried'),
  `Address` VARCHAR(2000),
  `Country` NUMERIC(10,0),
  `DepartmentID` NUMERIC(10,0),
  `JobTitleID` NUMERIC(10,0),
  `PayGradeID` NUMERIC(10,0),
  `EmploymentStatusID` NUMERIC(10,0),
  `SupervisorID` NUMERIC(10,0),
  `EmergencyContactID` NUMERIC(10,0),
--   `CustomAttribute1` VARCHAR(20),
--   `CustomAttribute2` VARCHAR(20),
  PRIMARY KEY (`EmployeeID`),
  FOREIGN KEY (`DepartmentID`) REFERENCES `Department`(`DepartmentID`),
  FOREIGN KEY (`JobTitleID`) REFERENCES `JobTitle`(`JobTitleID`),
  FOREIGN KEY (`PayGradeID`) REFERENCES `PayGrade`(`PayGradeID`),
  FOREIGN KEY (`EmploymentStatusID`) REFERENCES `EmploymentStatus`(`EmploymentStatusID`),
  FOREIGN KEY (`SupervisorID`) REFERENCES `Employee`(`EmployeeID`),
  FOREIGN KEY (`EmergencyContactID`) REFERENCES `EmergencyContact`(`EmergencyContactID`)
);
CREATE TABLE `DependentInfo` (
  `DependentInfoID` NUMERIC(10,0), 
  `EmployeeID` NUMERIC(10,0),
  `DependentName` VARCHAR(20),
  `DependentAge` NUMERIC(10,0),
  PRIMARY KEY (`DependentInfoID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`)
);
-- ------------------------------------------------------------------------------
CREATE TABLE `UserAccountLevel` (
  `UserAccountLevelID` NUMERIC(10,0),
  `UserAccountLevelName` VARCHAR(32),
  `OwnProfileDetailsAccess` ENUM('NO','VIEW','EDIT'),
  `EveryProfileDetailsAccess` ENUM('NO','VIEW','EDIT'),
  PRIMARY KEY (`UserAccountLevelID`)
);
CREATE TABLE `UserAccount` (
  `UserID` NUMERIC(10,0),
  `Username` VARCHAR(32) UNIQUE,
  `EmployeeID` NUMERIC(10,0) UNIQUE,
  `Email` VARCHAR(64) UNIQUE,
  `PasswordHash` VARCHAR(100),
  `UserAccountLevelID` NUMERIC(10,0),
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`),
  FOREIGN KEY (`UserAccountLevelID`) REFERENCES `UserAccountLevel`(`UserAccountLevelID`)
);
-- -------------------------------------------------------------------------------
CREATE TABLE `Leave` (
  `LeaveID` NUMERIC(10,0),
  `LeaveLogDateTime` DATETIME,
  `EmployeeID` NUMERIC(10,0),
  `Approved` BOOLEAN, 
  `Reason` VARCHAR(100),
  `LeaveType` ENUM('Annual', 'Casual', 'Maternity', 'No-Pay'),
  `FirstAbsentDate` DATE,
  `LastAbsentDate` DATE,
  `LeaveDayCount` NUMERIC(3,0),
  `ApprovedDateTime` DATETIME,
  `ApprovedByID` NUMERIC(10,0),
  PRIMARY KEY (`LeaveID`),
  FOREIGN KEY (`ApprovedByID`) REFERENCES `Employee`(`EmployeeID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`)
);
CREATE TABLE `Salary` (
  `SalaryID` NUMERIC(10,0),
  `JobTitleID` NUMERIC(10,0),
  `EmploymentStatusID` NUMERIC(10,0), 
  `PayGradeID` NUMERIC(10,0),
  `Salary` NUMERIC(10,3),
  PRIMARY KEY (`SalaryID`),
  FOREIGN KEY (`JobTitleID`) REFERENCES `JobTitle`(`JobTitleID`),
  FOREIGN KEY (`PayGradeID`) REFERENCES `PayGrade`(`PayGradeID`),
  FOREIGN KEY (`EmploymentStatusID`) REFERENCES `EmploymentStatus`(`EmploymentStatusID`)
);
-- -------------------------------------------------------------------------------
