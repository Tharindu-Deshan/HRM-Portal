

create database if not exists hrm_portal;
use hrm_portal;

-- Create schema hrm-portal;
-- -------------------------------------------------------------------------------
CREATE TABLE if not exists `Organization`(
  `OrganizationID` NUMERIC(10,0),
  `Name` VARCHAR(20),
  `Address` VARCHAR(50),
  `RegistrationNumber` VARCHAR(10),
  PRIMARY KEY (`OrganizationID`)
);
CREATE TABLE if not exists `Country` (
  `CountryID` NUMERIC(10,0), 
  `CountryName` VARCHAR(20),
  PRIMARY KEY (`CountryID`)
);
CREATE TABLE if not exists `Branch` (
  `BranchID` NUMERIC(10,0), 
  `BranchName` VARCHAR(20),
  `CountryID` NUMERIC(10,0),
  `OrganizationID` NUMERIC(10,0),
  PRIMARY KEY (`BranchID`),
  FOREIGN KEY (`OrganizationID`) REFERENCES `Organization`(`OrganizationID`),
  FOREIGN KEY (`CountryID`) REFERENCES `Country`(`CountryID`)
);
-- -------------------------------------------------------------------------------
CREATE TABLE if not exists `PayGrade` (
  `PayGradeID` NUMERIC(10,0),
  `PayGradeName` VARCHAR(20),
  `AnnualLeaveCount` NUMERIC(3,0),
  `CasualLeaveCount` NUMERIC(3,0),
  `MaternityLeaveCount` NUMERIC(3,0),
  `PayLeaveCount` NUMERIC(3,0),
  PRIMARY KEY (`PayGradeID`)
);
-- -------------------------------------------------------------------------------
CREATE TABLE if not exists `EmergencyContact` (
  `EmergencyContactID` NUMERIC(10,0),
  `PrimaryName` VARCHAR(20),
  `PrimaryPhoneNumber` NUMERIC(20,0),
  `SecondaryName` VARCHAR(50),
  `SecondaryPhoneNumber` NUMERIC(20,0),
  `Address` VARCHAR(100),
  PRIMARY KEY (`EmergencyContactID`)
);
CREATE TABLE if not exists `Department` (
  `DepartmentID` VARCHAR(10),
  `DepartmentName` VARCHAR(20),
  PRIMARY KEY (`DepartmentID`)
);
CREATE TABLE if not exists `JobTitle` (
  `JobTitleID` NUMERIC(10,0), 
  `JobTitleName` VARCHAR(20),
  PRIMARY KEY (`JobTitleID`)
);
CREATE TABLE if not exists `EmploymentStatus` (
  `EmploymentStatusID` NUMERIC(10,0),
  `EmploymentStatusName` VARCHAR(20),
  PRIMARY KEY (`EmploymentStatusID`)
);
CREATE TABLE if not exists `Employee` (
  `EmployeeID` VARCHAR(10),  
  `EmployeeName` VARCHAR(20),
  `DateOfBirth` DATE,
  `Gender` ENUM('Male','Female'),
  `MaritalStatus` ENUM('Married','Unmarried'),
  `Address` VARCHAR(2000),
  `Country` NUMERIC(10,0),
  `DepartmentID` VARCHAR(10),
  `JobTitleID` NUMERIC(10,0),
  `PayGradeID` NUMERIC(10,0),
  `EmploymentStatusID` NUMERIC(10,0),
  `SupervisorID` VARCHAR(10),
  `EmergencyContactID` NUMERIC(10,0),
  PRIMARY KEY (`EmployeeID`),
  FOREIGN KEY (`DepartmentID`) REFERENCES `Department`(`DepartmentID`),
  FOREIGN KEY (`JobTitleID`) REFERENCES `JobTitle`(`JobTitleID`),
  FOREIGN KEY (`PayGradeID`) REFERENCES `PayGrade`(`PayGradeID`),
  FOREIGN KEY (`EmploymentStatusID`) REFERENCES `EmploymentStatus`(`EmploymentStatusID`),
  FOREIGN KEY (`SupervisorID`) REFERENCES `Employee`(`EmployeeID`),
  FOREIGN KEY (`EmergencyContactID`) REFERENCES `EmergencyContact`(`EmergencyContactID`)
);
CREATE TABLE if not exists `DependentInfo` (
  `DependentInfoID` NUMERIC(10,0), 
  `EmployeeID` VARCHAR(10),
  `DependentName` VARCHAR(20),
  `DependentAge` NUMERIC(10,0),
  PRIMARY KEY (`DependentInfoID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`)
);
-- ------------------------------------------------------------------------------
CREATE TABLE if not exists `UserAccountLevel` (
  `UserAccountLevelID` NUMERIC(10,0),
  `UserAccountLevelName` VARCHAR(32),
  `OwnProfileDetailsAccess` ENUM('NO','VIEW','EDIT'),
  `EveryProfileDetailsAccess` ENUM('NO','VIEW','EDIT'),
  `LeaveApproveAccess` ENUM('NO','VIEW','EDIT'),
  PRIMARY KEY (`UserAccountLevelID`)
);
CREATE TABLE if not exists `UserAccount` (
  `UserID` NUMERIC(10,0),
  `Username` VARCHAR(32) UNIQUE,
  `EmployeeID` VARCHAR(10),
  `Email` VARCHAR(64) UNIQUE,
  `PasswordHash` VARCHAR(100),
  `UserAccountLevelID` NUMERIC(10,0),
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`),
  FOREIGN KEY (`UserAccountLevelID`) REFERENCES `UserAccountLevel`(`UserAccountLevelID`)
);
-- -------------------------------------------------------------------------------
CREATE TABLE if not exists `Leave` (
  `LeaveID` NUMERIC(10,0),
  `LeaveLogDateTime` DATETIME,
  `EmployeeID` VARCHAR(10),
  `Approved` BOOLEAN, 
  `Reason` VARCHAR(100),
  `LeaveType` ENUM('Annual', 'Casual', 'Maternity', 'No-Pay'),
  `FirstAbsentDate` DATE,
  `LastAbsentDate` DATE,
  `LeaveDayCount` NUMERIC(3,0),
  `ApprovedDateTime` DATETIME,
  `ApprovedByID` VARCHAR(10),
  PRIMARY KEY (`LeaveID`),
  FOREIGN KEY (`ApprovedByID`) REFERENCES `Employee`(`EmployeeID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`)
);
CREATE TABLE if not exists `Salary` (
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
