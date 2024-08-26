drop database if exists hrm_portal; 

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
  `PayGradeID` 	NUMERIC(10,0),
  `PayGradeName` VARCHAR(20),
  `AnnualLeaveCount` NUMERIC(3,0),
  `CasualLeaveCount` NUMERIC(3,0),
  `MaternityLeaveCount` NUMERIC(3,0),
  `PayLeaveCount` NUMERIC(3,0),
  PRIMARY KEY (`PayGradeID`)
);
-- -------------------------------------------------------------------------------
CREATE TABLE if not exists `EmergencyContact` (
  `EmergencyContactID` INT AUTO_INCREMENT,
  `PrimaryName` VARCHAR(20),
  `PrimaryPhoneNumber` NUMERIC(20,0),
  `SecondaryName` VARCHAR(50),
  `SecondaryPhoneNumber` NUMERIC(20,0),
  `Address` VARCHAR(100),
  PRIMARY KEY (`EmergencyContactID`)
);
CREATE TABLE if not exists `Department` (
  `DepartmentID` VARCHAR(10),
  `DepartmentName` VARCHAR(40),
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
  `Country` VARCHAR(20),
  `DepartmentID` VARCHAR(10),
  `JobTitleID` NUMERIC(10,0),
  `PayGradeID` NUMERIC(10,0),
  `EmploymentStatusID` NUMERIC(10,0),
  `SupervisorID` VARCHAR(10),
  `EmergencyContactID` INT AUTO_INCREMENT,
  PRIMARY KEY (`EmployeeID`),
  FOREIGN KEY (`DepartmentID`) REFERENCES `Department`(`DepartmentID`),
  FOREIGN KEY (`JobTitleID`) REFERENCES `JobTitle`(`JobTitleID`),
  FOREIGN KEY (`PayGradeID`) REFERENCES `PayGrade`(`PayGradeID`),
  FOREIGN KEY (`EmploymentStatusID`) REFERENCES `EmploymentStatus`(`EmploymentStatusID`),
  FOREIGN KEY (`SupervisorID`) REFERENCES `Employee`(`EmployeeID`),
  FOREIGN KEY (`EmergencyContactID`) REFERENCES `EmergencyContact`(`EmergencyContactID`)
);
CREATE TABLE if not exists `DependentInfo` (
  `DependentInfoID` INT AUTO_INCREMENT, 
  `EmployeeID` VARCHAR(10),
  `DependentName` VARCHAR(20),
  `DependentAge` NUMERIC(10,0),
  PRIMARY KEY (`DependentInfoID`),
  FOREIGN KEY (`EmployeeID`) REFERENCES `Employee`(`EmployeeID`)
);
-- CREATE TABLE if not exists `CustomAttributesInfo` (
-- 	`CustomAttributesInfoID` INT AUTO_INCREMENT,
--     `EmployeeID` VARCHAR(10),
--     PRIMARY KEY(`CustomAttributesInfoID`),
--     FOREIGN KEY(`EmployeeID`) REFERENCES `Employee`(`EmployeeID`)
-- );
CREATE TABLE IF NOT EXISTS `EmployeeCustomAttributes` (
  `CustomAttributeID` INT AUTO_INCREMENT,
  `EmployeeID` VARCHAR(10),
  `AttributeName` VARCHAR(50),
  `AttributeValue` TEXT,
  PRIMARY KEY (`CustomAttributeID`),
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
  `LeaveID` INT auto_increment,
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
-- --------Triggers------------------------------------------------------------------------------

DELIMITER //

CREATE TRIGGER `before_employee_delete`
BEFORE DELETE ON `Employee`
FOR EACH ROW
BEGIN
    -- Delete related records in the DependentInfo table
    DELETE FROM `DependentInfo` WHERE `EmployeeID` = OLD.EmployeeID;
    
    -- Delete related records in the UserAccount table
    DELETE FROM `UserAccount` WHERE `EmployeeID` = OLD.EmployeeID;
    
    -- Set NULL to supervisor references in Employee table
    UPDATE `Employee` SET `SupervisorID` = NULL WHERE `SupervisorID` = OLD.EmployeeID;
    
    -- Delete related records in the Leave table
    DELETE FROM `Leave` WHERE `EmployeeID` = OLD.EmployeeID OR `ApprovedByID` = OLD.EmployeeID;
    
    -- Add any other related table cleanup logic here as needed
END;

//

DELIMITER ;


DELIMITER //

CREATE TRIGGER `before_useraccount_insert_check_email`
BEFORE INSERT ON `UserAccount`
FOR EACH ROW
BEGIN
    -- Check if the email already exists
    IF EXISTS (SELECT 1 FROM `UserAccount` WHERE `Email` = NEW.Email) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Duplicate email detected!';
    END IF;
END;

//
DELIMITER //

CREATE TRIGGER `before_employee_custom_attributes_insert_check`
BEFORE INSERT ON `EmployeeCustomAttributes`
FOR EACH ROW
BEGIN
    -- Check if the employee and custom attribute already exists
    IF EXISTS (
        SELECT 1 
        FROM `EmployeeCustomAttributes` 
        WHERE `EmployeeID` = NEW.`EmployeeID` 
        AND `AttributeName` = NEW.`AttributeName`
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Duplicate employee custom attribute detected!';
    END IF;
END;
//
DELIMITER ;


-- Create AuditLog table for tracking deleted employees
CREATE TABLE if not exists `AuditLog` (
  `LogID` INT AUTO_INCREMENT,
  `Action` VARCHAR(50),
  `TableName` VARCHAR(50),
  `RecordID` VARCHAR(20),
  `Timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LogID`)
);

-- Trigger to add entry to AuditLog when an Employee is deleted
DELIMITER //

CREATE TRIGGER `after_employee_delete`
AFTER DELETE ON `Employee`
FOR EACH ROW
BEGIN
    INSERT INTO `AuditLog` (`Action`, `TableName`, `RecordID`) 
    VALUES ('DELETE', 'Employee', OLD.EmployeeID);
END;

//

DELIMITER ;

-- Trigger to check leave count before inserting a new leave
DELIMITER //

CREATE TRIGGER `before_leave_insert`
BEFORE INSERT ON `Leave`
FOR EACH ROW
BEGIN
    DECLARE available_leave_count INT;
    DECLARE paygrade_id NUMERIC(10,0);
    
    -- Get the PayGradeID for the employee
    SELECT PayGradeID INTO paygrade_id FROM Employee WHERE EmployeeID = NEW.EmployeeID;
    
    -- Check available leave count based on the leave type
    CASE NEW.LeaveType
        WHEN 'Annual' THEN
            SELECT AnnualLeaveCount INTO available_leave_count FROM PayGrade WHERE PayGradeID = paygrade_id;
        WHEN 'Casual' THEN
            SELECT CasualLeaveCount INTO available_leave_count FROM PayGrade WHERE PayGradeID = paygrade_id;
        WHEN 'Maternity' THEN
            SELECT MaternityLeaveCount INTO available_leave_count FROM PayGrade WHERE PayGradeID = paygrade_id;
        WHEN 'No-Pay' THEN
            SELECT PayLeaveCount INTO available_leave_count FROM PayGrade WHERE PayGradeID = paygrade_id;
    END CASE;
    
    -- If applied leave count is more than available leave count, throw an error
    IF NEW.LeaveDayCount > available_leave_count THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough leaves available';
    END IF;
END;

//

DELIMITER ;



-- -------------------------------------------------------------------------------

-- Insrting sample data
-- ------------------------------------------------------------------------

  -- Sample data for Organization table
INSERT INTO Organization (OrganizationID, Name, Address, RegistrationNumber)
VALUES
  (1, 'Jupiter Apparels', '123 Main St', 'ABC123');
  
-- Sample data for the Country table
INSERT INTO Country (CountryID, CountryName)
VALUES
  (1, 'Sri Lanka'),
  (2, 'Bangladesh'),
  (3, 'Pakistan');

-- Sample data for the Branch table
INSERT INTO Branch (BranchID, BranchName, CountryID, OrganizationID)
VALUES
  (1, 'Branch 1', 1, 1),
  (2, 'Branch 2', 2, 1),
  (3, 'Branch 3', 3, 1),
  (4, 'Branch 3', 1, 1);
  
  -- Sample data for UserAccountLevel table
INSERT INTO UserAccountLevel (UserAccountLevelID, UserAccountLevelName, OwnProfileDetailsAccess, EveryProfileDetailsAccess,LeaveApproveAccess)
VALUES
  (1, 'Level4', 'EDIT', 'EDIT','EDIT'), -- admin
  (2, 'Level3', 'EDIT', 'EDIT','EDIT'), -- hr manager
  (3, 'Level2', 'VIEW', 'NO','EDIT'), -- supervisor
  (4, 'Level1', 'VIEW', 'NO','NO'); -- employee
  
  -- Sample data for PayGrade table
  INSERT INTO PayGrade (PayGradeID, PayGradeName, AnnualLeaveCount, CasualLeaveCount, MaternityLeaveCount, PayLeaveCount)
VALUES
    (1, 'Level 1', 25, 10, 12, 5),
    (2, 'Level 2', 20, 8, 14, 6),
    (3, 'Level 3', 18, 7, 10, 4);

-- Sample data for JobTitle table
INSERT INTO JobTitle (JobTitleID, JobTitleName)
VALUES
    (1, 'HR Manager'),
    (2, 'Accountant'),
    (3, 'Software Engineer'),
    (4, 'QA Engineer');

-- Sample data for EmploymentStatus table
INSERT INTO EmploymentStatus (EmploymentStatusID, EmploymentStatusName)
VALUES
    (1, 'Intern (fulltime)'),
    (2, 'Intern (parttime)'),
    (3, 'Contract (fulltime)'),
    (4, 'Contract (parttime)'),
    (5, 'Permanent'),
    (6, 'Freelance');

-- Sample data for Salary table
INSERT INTO Salary (SalaryID, JobTitleID, EmploymentStatusID, PayGradeID, Salary)
VALUES
    (1, 1, 1, 1, 35000),
    (2, 2, 2, 2, 40000),
    (3, 3, 3, 1, 60000),
    (4, 4, 4, 2, 45000),
    (5, 1, 5, 3, 70000),
    (6, 2, 6, 3, 75000),
    (7, 3, 1, 2, 55000),
    (8, 4, 2, 1, 38000),
    (9, 1, 3, 3, 68000),
    (10, 2, 4, 2, 42000);

-- Sample data for EmergencyContact table
INSERT INTO EmergencyContact (EmergencyContactID, PrimaryName, PrimaryPhoneNumber, SecondaryName, SecondaryPhoneNumber, Address)
VALUES
  (001,'Sunil Perera', 0775648923 , 'Kumudu Perera', 0714568239 , '123, Main St, Negombo'),
  (002, 'Kamal Kumarasinghe', 0715248369 , 'Sriyavi Perera', 0745281361 , '46, Katubedda, Moratuwa'),
  (003, 'Emily Fernando', 0771284635, 'John Rodrigo', 01145823448 , '11/D, St. Mary Road,Kalutara'),
  (004, 'Piyawathi Fonseka',0784465531,'Kusum Renuka', 0112263495, '29/A,Fernando Lane,Kalubowila'),
  (005, 'Sara Ann',0112556482,'Kalum Jayatilake', 0773325042, '11,Wewala, Ja ela' ),
  (006, 'Rohan Silva', '0776987451', 'Manel Silva', '0712356987', '56, Lake View, Colombo'),
  (007, 'Priyantha Bandara', '0715648235', 'Chamari Bandara', '0774521369', '35, Hill Road, Kandy'),
  (008, 'Lahiru Perera', '0778956234', 'Amaya Perera', '0713269852', '17, Palm Grove, Galle'),
  (009, 'Nadeesha Fernando', '0712345678', 'Sanjeewa Fernando', '0778765432', '45, Beach Lane, Negombo'),
  (010, 'Thilini Jayawardena', '0719856234', 'Mahesh Jayawardena', '0773265987', '27, Paradise Drive, Colombo')
  ;

  
  -- Sample data for Department table
INSERT INTO Department (DepartmentID, DepartmentName)
VALUES
  (001 , 'IT'),
  (002, 'Human Resources'),
  (003, 'Finance'),
  (004, 'Sales'),
  (005, 'Production');

 -- Sample data for Employee table
INSERT INTO employee(EmployeeID, EmployeeName, DateOfBirth, Gender, MaritalStatus, Address, Country, DepartmentID, JobTitleID, PayGradeID, EmploymentStatusID, SupervisorID, EmergencyContactID)
VALUES
  ('EM-0001', 'Sirimal Perera', '1975-04-24', 'Male', 'Married', '95, 1st Lane, Egodawatta', 'Sri Lanka', 2, 1, 1, 5, NULL, 1),
  ('EM-0002', 'Shriyani Wijesooriya', '1992-06-09', 'Female', 'Unmarried', '23, 2nd Lane, Kadawatha', 'Sri Lanka', 1, 3, 2, 5, 'EM-0001', 2),
  ('EM-0003', 'Shantha Silva', '1978-06-09', 'Male', 'Unmarried', '4, 2nd Lane, Kadawatha', 'Sri Lanka', 4, 3, 2, 4, 'EM-0001', 3),
  ('EM-0004', 'Nimali Fernando', '1989-07-21', 'Female', 'Married', '26, 3rd Lane, Kottawa', 'Sri Lanka', 4, 2, 2, 3, 'EM-0002', 5),
  ('EM-0005', 'Kamal Perera', '1982-03-15', 'Male', 'Married', '42, 4th Lane, Kandy', 'Sri Lanka', 3, 2, 2, 4, 'EM-0001', 9),
  ('EM-0006', 'Mala Gunasekara', '1990-11-30', 'Female', 'Married', '14, 5th Lane, Colombo', 'Sri Lanka', 1, 4, 3, 5, 'EM-0003', 10),
  ('EM-0007', 'Saman Jayasuriya', '1985-08-18', 'Male', 'Married', '34, 6th Lane, Galle', 'Sri Lanka', 5, 4, 2, 5, 'EM-0001', 4),
  ('EM-0008', 'Lakshika Perera', '1994-04-05', 'Female', 'Unmarried', '17, 7th Lane, Matara', 'Sri Lanka', 2, 1, 1, 4, 'EM-0001', 6),
  ('EM-0009', 'Nihal Ranasinghe', '1980-12-12', 'Male', 'Married', '56, 8th Lane, Kegalle', 'Sri Lanka', 1, 3, 3, 5, 'EM-0005', 7),
  ('EM-0010', 'Priyanka Fernando', '1988-09-28', 'Female', 'Married', '12, 9th Lane, Badulla', 'Sri Lanka', 4, 2, 2, 4, 'EM-0006', 8),
  -- new sample data  --
  ('EM-0011', 'Kasun Bandara', '1992-07-10', 'Male', 'Married', '5, 1st Lane, Homagama', 'Sri Lanka', 4, 2, 1, 2, 'EM-0005', 1),
  ('EM-0012', 'Gayan Dissanayake', '1993-04-19', 'Male', 'Unmarried', '14, 2nd Lane, Pannipitiya', 'Sri Lanka', 3, 3, 2, 5, 'EM-0001', 2),
  ('EM-0013', 'Nuwani Perera', '1994-06-25', 'Female', 'Married', '25, 5th Lane, Maharagama', 'Sri Lanka', 3, 4, 3, 4, 'EM-0005', 3),
  ('EM-0014', 'Saman Liyanage', '1995-08-03', 'Male', 'Unmarried', '2, 1st Lane, Maharagama', 'Sri Lanka', 2, 2, 3, 1, 'EM-0001', 4),
  ('EM-0015', 'Tharindu Jyasinghe', '1996-01-09', 'Male', 'Married', '21, 7th Lane, Nugegoda', 'Sri Lanka', 5, 2, 3, 1, 'EM-0006', 6),
  ('EM-0016', 'Aruni Gamage', '1993-07-07', 'Female', 'Married', '2, 7th Lane, Homagama', 'Sri Lanka', 5, 1, 2, 5, 'EM-0001', 5),
  ('EM-0017', 'Manjula Kumari', '1993-06-18', 'Female', 'Married', '14, 3rd Lane, Pannipitiya', 'Sri Lanka', 3, 4, 3, 6, 'EM-0016', 7),
  ('EM-0018', 'Thushara de Silva', '1996-02-24', 'Female', 'Unmarried', '20, 3rd Lane, Nugegoda', 'Sri Lanka', 5, 1, 2, 3, 'EM-0016', 9),
  ('EM-0019', 'Harshani Peiris', '1995-10-03', 'Female', 'Unmarried', '4, 9th Lane, Homagama', 'Sri Lanka', 2, 3, 3, 5, 'EM-0018', 10),
  ('EM-0020', 'Nethmi Fenando', '1997-11-09', 'Female', 'Unmarried', '19, 9th Lane, Nugegoda', 'Sri Lanka', 5, 3, 3, 1, 'EM-0018', 8);

  
 -- Sample data for dependentInfo table
INSERT INTO dependentinfo(DependentInfoID, EmployeeID, DependentName, DependentAge)
VALUES
  (1 , "EM-0001", 'Pasindu Perera', 15),
  (2, "EM-0002", 'Tharushi Perera', 12),
  (3, "EM-0003", 'Sachini Silva', 16),
  (4, "EM-0004", 'Kavindu Fernando', 26),
  (5, "EM-0005", 'Chathuri Perera', 29),
  (6, "EM-0006", 'Yasitha Gunasekara', 23),
  (7, "EM-0007", 'Saman Jr. Jayasuriya', 35),
  (8, "EM-0008", 'Lakshika Jr. Perera', 27),
  (9, "EM-0009", 'Nihal Ranasinghe', 20),
  (10, "EM-0010", 'Priyanka Fernando', 24);

-- Sample data for userAccount table
INSERT INTO userAccount(userID, username, EmployeeID, Email, PasswordHash, userAccountLevelID)
VALUES
	(1, 'admin123', 'EM-0001', 'admin@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 1),
	(2, 'wjiesooriya92', 'EM-0002', 'wijesooriya92@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 3),
	(3, 'shantha78', 'EM-0003', 'shantha78@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4),
	(4, 'nimali89', 'EM-0004', 'nimali89@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4),
	(5, 'kamal82', 'EM-0005', 'kamal82@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 2),
	(6, 'mala90', 'EM-0006', 'mala90@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 3),
	(7, 'saman85', 'EM-0007', 'saman85@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4),
	(8, 'lakshika94', 'EM-0008', 'lakshika94@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 2),
	(9, 'nihal80', 'EM-0009', 'nihal80@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 3),
	(10, 'priyanka88', 'EM-0010', 'priyanka88@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4),
    -- new entries
    (11, 'kasun92', 'EM-0011', 'kasun92@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 3),
	(12, 'gayan93', 'EM-0012', 'gayan93@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4),
	(13, 'nuwani94', 'EM-0013', 'nuwani94@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 2),
	(14, 'saman95', 'EM-0014', 'saman95@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4),
	(15, 'tharindu96', 'EM-0015', 'tharindu96@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 3),
	(16, 'aruni93', 'EM-0016', 'aruni93@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 2),
	(17, 'manjula93', 'EM-0017', 'manjula93@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4),
	(18, 'thushara96', 'EM-0018', 'thushara96@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 2),
	(19, 'harshani95', 'EM-0019', 'harshani95@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 3),
	(20, 'nethmi97', 'EM-0020', 'nethmi97@gmail.com', '$2b$10$DcwLvdXofqQ1Ty/ReChBqOFWkr5TQ5TQVY3qTTdfGuZrYcEP..Sa6', 4);

    
-- Sample data for leave table
INSERT INTO `leave`(LeaveLogDateTime,EmployeeID,Approved,Reason,LeaveType,FirstAbsentDate,LastAbsentDate,LeaveDayCount,ApprovedDateTime,ApprovedByID)
VALUES
	('2023-10-16 10:25:31', "EM-0003", 1, "Personal leave", "Casual", '2023-10-18', '2023-10-20', 3, '2023-10-17 04:00:31', "EM-0002"),
    ('2023-10-16 09:47:19', "EM-0004", 1, "Sick leave", "Annual", '2023-10-17', '2023-10-17', 1, '2023-10-16 04:03:56', "EM-0002"),
    ('2023-10-17 12:41:43', "EM-0003", -1, "Personal reasons", "Annual", '2023-10-20', '2023-10-21', 2, '2023-10-18 10:12:42', "EM-0001"),
	('2023-10-19 14:25:10', 'EM-0005', -1, 'Family emergency', 'Casual', '2023-10-20', '2023-10-21', 2, '2023-10-19 15:45:12', 'EM-0002'),
	('2023-10-22 08:12:37', 'EM-0006', 1, 'Vacation', 'Annual', '2023-10-23', '2023-10-27', 5, '2023-10-22 10:30:58', 'EM-0003'),
	('2023-10-15 09:30:15', 'EM-0007', 1, 'Medical leave', 'Annual', '2023-10-16', '2023-10-17', 2, '2023-10-16 14:20:30', 'EM-0004'),
	('2023-10-25 16:05:20', 'EM-0008', 0, 'Personal reasons', 'Casual', '2023-10-26', '2023-10-27', 2, NULL, NULL),
	('2023-10-18 11:20:55', 'EM-0009', 1, 'Vacation', 'Annual', '2023-10-19', '2023-10-22', 4, '2023-10-18 13:45:08', 'EM-0005'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-06 16:20:20', 'EM-0002', 0, 'Personal reasons', 'Casual', '2023-12-07', '2023-12-07', 1, NULL, NULL),
	('2023-12-07 09:30:15', 'EM-0003', 0, 'Personal leave', 'Casual', '2023-12-08', '2023-12-08', 1, NULL, NULL),
	('2023-12-08 16:20:20', 'EM-0004', 1, 'Medical leave', 'Annual', '2023-12-09', '2023-12-10', 2, '2023-12-08 18:45:35', 'EM-0005'),
	('2023-12-09 09:30:15', 'EM-0005', 1, 'Vacation', 'Annual', '2023-12-10', '2023-12-13', 4, '2023-12-09 11:45:30', 'EM-0003'),
	('2023-12-10 16:20:20', 'EM-0006', 0, 'Personal reasons', 'Casual', '2023-12-11', '2023-12-11', 1, NULL, NULL),
	('2023-12-11 09:30:15', 'EM-0007', 1, 'Family emergency', 'Casual', '2023-12-12', '2023-12-13', 2, '2023-12-11 11:45:30', 'EM-0008'),
	('2023-12-12 16:20:20', 'EM-0008', 1, 'Vacation', 'Annual', '2023-12-13', '2023-12-16', 4, '2023-12-12 18:45:35', 'EM-0005'),
	('2023-12-13 09:30:15', 'EM-0009', 0, 'Personal leave', 'Casual', '2023-12-14', '2023-12-14', 1, NULL, NULL),
	('2023-12-14 16:20:20', 'EM-0010', 1, 'Medical leave', 'No-Pay', '2023-12-15', '2023-12-16', 2, '2023-12-14 18:45:35', 'EM-0009'),
	('2023-12-15 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-16', '2023-12-19', 4, '2023-12-15 11:45:30', 'EM-0010'),
	('2023-12-16 16:20:20', 'EM-0002', 0, 'Personal reasons', 'Casual', '2023-12-17', '2023-12-17', 1, NULL, NULL),
	('2023-12-17 09:30:15', 'EM-0003', 1, 'Personal leave', 'Casual', '2023-12-18', '2023-12-18', 1, '2023-12-17 11:45:30', 'EM-0001'),
	('2023-12-18 16:20:20', 'EM-0004', 1, 'Medical leave', 'No-Pay', '2023-12-19', '2023-12-20', 2, '2023-12-18 18:45:35', 'EM-0002'),
	('2023-12-19 09:30:15', 'EM-0005', 1, 'Vacation', 'Annual', '2023-12-20', '2023-12-23', 4, '2023-12-19 11:45:30', 'EM-0004'),
	('2023-12-20 16:20:20', 'EM-0006', 0, 'Personal reasons', 'Casual', '2023-12-21', '2023-12-21', 1, NULL, NULL),
	('2023-12-21 09:30:15', 'EM-0007', 1, 'Family emergency', 'Casual', '2023-12-22', '2023-12-23', 2, '2023-12-21 11:45:30', 'EM-0008'),
	('2023-12-22 16:20:20', 'EM-0008', 1, 'Vacation', 'Annual', '2023-12-23', '2023-12-26', 4, '2023-12-22 18:45:35', 'EM-0007'),
	('2023-12-23 09:30:15', 'EM-0009', 0, 'Personal leave', 'Casual', '2023-12-24', '2023-12-24', 1, NULL, NULL),
	('2023-12-24 16:20:20', 'EM-0010', 1, 'Medical leave', 'No-Pay', '2023-12-25', '2023-12-26', 2, '2023-12-24 18:45:35', 'EM-0009'),
	('2023-12-25 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-26', '2023-12-29', 4, '2023-12-25 11:45:30', 'EM-0010'),
	('2023-12-26 16:20:20', 'EM-0002', 0, 'Personal reasons', 'Casual', '2023-12-27', '2023-12-27', 1, NULL, NULL),
	('2023-12-27 09:30:15', 'EM-0003', 1, 'Personal leave', 'Casual', '2023-12-28', '2023-12-28', 1, '2023-12-27 11:45:30', 'EM-0001'),
	('2023-12-28 16:20:20', 'EM-0004', 1, 'Medical leave', 'Maternity', '2023-12-29', '2023-12-30', 2, '2023-12-28 18:45:35', 'EM-0002'),
	('2023-12-29 09:30:15', 'EM-0005', 1, 'Vacation', 'Annual', '2023-12-30', '2023-12-31', 3, '2023-12-29 11:45:30', 'EM-0004'),
	('2023-12-30 16:20:20', 'EM-0006', 0, 'Personal reasons', 'Casual', '2023-12-31', '2023-12-31', 1, NULL, NULL),
	('2023-12-31 09:30:15', 'EM-0007', 1, 'Family emergency', 'Casual', '2024-01-01', '2024-01-02', 2, '2023-12-31 11:45:30', 'EM-0008'),
	('2024-01-01 16:20:20', 'EM-0008', 1, 'Vacation', 'Annual', '2024-01-02', '2024-01-05', 4, '2024-01-01 18:45:35', 'EM-0007'),
	('2024-01-02 09:30:15', 'EM-0009', 0, 'Personal leave', 'Casual', '2024-01-03', '2024-01-03', 1, NULL, NULL),
	('2024-01-03 16:20:20', 'EM-0010', 1, 'Medical leave', 'Maternity', '2024-01-04', '2024-01-05', 2, '2024-01-03 18:45:35', 'EM-0009'),
	('2024-01-04 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2024-01-05', '2024-01-08', 4, '2024-01-04 11:45:30', 'EM-0010'),
	('2024-01-05 16:20:20', 'EM-0002', 0, 'Personal reasons', 'Casual', '2024-01-06', '2024-01-06', 1, NULL, NULL),
	('2024-01-06 09:30:15', 'EM-0003', 1, 'Personal leave', 'Casual', '2024-01-07', '2024-01-07', 1, '2024-01-06 11:45:30', 'EM-0001'),
	('2024-01-07 16:20:20', 'EM-0004', 1, 'Medical leave', 'No-Pay', '2024-01-08', '2024-01-09', 2, '2024-01-07 18:45:35', 'EM-0002'),
	('2024-01-08 09:30:15', 'EM-0005', 1, 'Vacation', 'Annual', '2024-01-09', '2024-01-12', 4, '2024-01-08 11:45:30', 'EM-0004'),
	('2024-01-09 16:20:20', 'EM-0006', 0, 'Personal reasons', 'Casual', '2024-01-10', '2024-01-10', 1, NULL, NULL),
	('2024-01-10 09:30:15', 'EM-0007', 1, 'Family emergency', 'Casual', '2024-01-11', '2024-01-12', 2, '2024-01-10 11:45:30', 'EM-0008'),
	('2024-01-11 16:20:20', 'EM-0008', 1, 'Vacation', 'Annual', '2024-01-12', '2024-01-15', 4, '2024-01-11 18:45:35', 'EM-0007'),
	('2024-01-12 09:30:15', 'EM-0009', 0, 'Personal leave', 'Casual', '2024-01-13', '2024-01-13', 1, NULL, NULL),
	('2024-01-13 16:20:20', 'EM-0010', 1, 'Medical leave', 'No-Pay', '2024-01-14', '2024-01-15', 2, '2024-01-13 18:45:35', 'EM-0009'),
	('2024-01-14 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2024-01-15', '2024-01-18', 4, '2024-01-14 11:45:30', 'EM-0010'),
	('2024-01-15 16:20:20', 'EM-0002', 0, 'Personal reasons', 'Casual', '2024-01-16', '2024-01-16', 1, NULL, NULL),
    -- new entries 
    ('2023-10-04 15:09:18', 'EM-0011', 1, 'Personal leave', 'No-Pay', '2023-10-05', '2023-10-08', 3, '2023-10-05 04:00:31', 'EM-0005'),
    ('2024-02-17 05:29:16', 'EM-0011', 1, 'Medical leave', 'Casual', '2024-02-17', '2024-02-18', 2, '2024-02-17 08:01:30', 'EM-0005'),
	('2023-11-08 18:02:45', 'EM-0012', 1, 'Personal leave', 'Annual', '2023-11-09', '2023-11-09', 1, '2023-11-08 19:00:31', 'EM-0001'),
	('2024-02-13 10:48:53', 'EM-0012', 1, 'Medical leave', 'Annual', '2024-02-14', '2024-02-15', 2, '2024-02-13 11:30:21', 'EM-0001'),
	('2023-10-22 13:49:27', 'EM-0013', 1, 'Sick leave', 'Casual', '2023-10-22', '2023-10-22', 1, '2023-10-22 03:15:11', 'EM-0005'),
	('2024-01-17 12:27:59', 'EM-0013', 0, 'Sick leave', 'No-Pay', '2024-01-17', '2024-01-19', 3, NULL, NULL),
	('2023-11-22 05:29:16', 'EM-0014', 1, 'Medical leave', 'Annual', '2023-11-23', '2023-11-23', 1, '2023-11-22 12:48:53', 'EM-0001'),
	('2024-01-27 23:10:20', 'EM-0014', 0, 'Personal reason', 'Casual', '2024-01-28', '2024-01-29', 2, NULL, NULL),
	('2023-10-26 03:15:11', 'EM-0015', 0, 'Personal reason', 'No-Pay', '2023-10-26', '2023-10-26', 1, NULL, NULL),
	('2024-03-05 05:40:43', 'EM-0015', 1, 'Medical leave', 'Casual', '2024-03-05', '2024-03-05', 1, '2024-03-05 10:48:53', 'EM-0006'),
	('2023-10-01 06:36:08', 'EM-0016', 0, 'Personal leave', 'Annual', '2023-10-02', '2023-10-04', 3, NULL, NULL),
	('2024-03-02 08:57:50', 'EM-0016', 1, 'Sick leave', 'No-Pay', '2024-03-03', '2024-03-03', 1, '2024-03-03 04:00:31', 'EM-0001'),
	('2023-11-24 10:30:04', 'EM-0017', 1, 'Medical leave', 'No-Pay', '2023-11-25', '2023-11-26', 2, '2023-11-25 19:05:06', 'EM-0016'),
	('2024-01-16 12:48:53', 'EM-0017', 0, 'Personal reason', 'Casual', '2024-01-16', '2024-01-16', 1, NULL, NULL),
	('2023-12-19 05:37:27', 'EM-0018', 1, 'Medical leave', 'No-Pay', '2023-12-20', '2023-12-20', 1, '2023-12-20 06:36:08', 'EM-0016'),
	('2024-03-19 08:29:41', 'EM-0018', 1, 'Medical leave', 'No-Pay', '2024-03-20', '2024-03-20', 1, '2024-03-20 04:00:31', 'EM-0016'),
	('2023-11-20 19:05:06', 'EM-0019', 0, 'Sick leave', 'Annual', '2023-11-21', '2023-11-21', 1, NULL, NULL),
	('2024-01-05 12:23:09', 'EM-0019', 1, 'Medical leave', 'Annual', '2024-01-06', '2024-01-07', 2, '2024-01-06 05:29:16', 'EM-0018'),
	('2023-12-07 11:11:08', 'EM-0020', 1, 'Personal reason', 'Casual', '2023-12-08', '2023-12-09', 2, '2023-12-08 05:29:16', 'EM-0018'),
	('2024-03-26 21:53:54', 'EM-0020', 1, 'Sick leave', 'Casual', '2024-03-28', '2024-03-28', 1, '2024-03-27 19:05:06', 'EM-0018'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0006', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0006', 1, 'Vacation', 'Annual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Casual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Casual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0006', 1, 'Vacation', 'Casual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
	('2023-12-05 09:30:15', 'EM-0006', 1, 'Vacation', 'Casual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0006', 1, 'Vacation', 'Casual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
	('2023-12-05 09:30:15', 'EM-0006', 1, 'Vacation', 'Casual', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0005', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
	('2023-12-05 09:30:15', 'EM-0005', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0005', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0004'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Medical leave', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Medical leave', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'No-Pay', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0004'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Medical leave', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0004', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0004', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0004', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0004', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
	('2023-12-05 09:30:15', 'EM-0001', 1, 'Vacation', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0003'),
    ('2023-12-05 09:30:15', 'EM-0001', 1, 'Medical leave', 'Maternity', '2023-12-06', '2023-12-09', 4, '2023-12-05 11:45:30', 'EM-0002');
-- DELETE FROM Employee WHERE EmployeeID = 'EM-0001';leave

INSERT INTO EmployeeCustomAttributes(EmployeeID,AttributeName,AttributeValue) 
VALUES
	('EM-0001','Weight',85),
    ('EM-0002','Weight',85),
    ('EM-0003','Weight',65),
    ('EM-0004','Weight',55),
    ('EM-0006','Weight',55),
    ('EM-0005','Weight',55),
    ('EM-0010','Weight',58),
    ('EM-0007','Weight',80),
    ('EM-0001','Religon','Buddist'),
    ('EM-0002','Religon','Hindu'),
    ('EM-0003','Religon','Buddist'),
    ('EM-0004','Religon','Buddist'),
    ('EM-0005','Religon','Buddist');

-- INDEXES to improve performence

-- Index on leave.Approved
CREATE INDEX idx_leave_Approved ON `leave` (Approved);

-- Index on employeecustomattributes.AttributeName
CREATE INDEX idx_employeecustomattributes_AttributeName ON `employeecustomattributes` (AttributeName);

-- Index on useraccountlevel.UserAccountLevelName
CREATE INDEX idx_useraccountlevel_AttributeName ON `useraccountlevel` (UserAccountLevelName);


-- ------------------------------------------------------------------------------------------------
-- PROCEDURES
-- ------------------------------------------------------------------------------------------------

DELIMITER //

CREATE PROCEDURE UpdateEmployeeAndRelatedData(
    IN p_EmployeeID VARCHAR(10),
    IN p_EmployeeName VARCHAR(40),
    IN p_DateOfBirth DATE,
    IN p_Gender enum('Male','Female'),
    IN p_MaritalStatus enum('Married','Unmarried'),
    IN p_Address varchar(2000),
    IN p_Country VARCHAR(20),
    IN p_DepartmentID varchar(10),
    IN p_JobTitleID decimal(10,0),
    IN p_PayGradeID decimal(10,0),
    IN p_EmploymentStatusID decimal(10,0),
    IN p_SupervisorID VARCHAR(10),
    IN p_UserID decimal(10,0),
    IN p_Username varchar(32),
    IN p_Email varchar(64),
    IN p_UserAccountLevelID decimal(10,0),
    IN p_DependentName VARCHAR(20),
    IN p_DependentAge decimal(10,0),
    IN p_PrimaryName VARCHAR(30),
    IN p_PrimaryPhoneNumber VARCHAR(20),
    IN p_SecondaryName VARCHAR(30),
    IN p_SecondaryPhoneNumber VARCHAR(20),
    IN p_emergencyAddress VARCHAR(100)
)
BEGIN
    DECLARE v_EmergencyContactID INT;

    -- Get the EmergencyContactID from the employee's data
    SELECT EmergencyContactID INTO v_EmergencyContactID
    FROM employee
    WHERE EmployeeID = p_EmployeeID;

    -- Update the emergency contact information
    UPDATE emergencyContact
	SET
		PrimaryName = p_PrimaryName,
		PrimaryPhoneNumber = p_PrimaryPhoneNumber,
		SecondaryName = p_SecondaryName,
		SecondaryPhoneNumber = p_SecondaryPhoneNumber,
        Address = p_emergencyAddress
	WHERE
		EmergencyContactID = v_EmergencyContactID;

    -- Update the employee table
    UPDATE employee
    SET
        EmployeeName = p_EmployeeName,
        DateOfBirth = p_DateOfBirth,
        Gender = p_Gender,
        MaritalStatus = p_MaritalStatus,
        Address = p_Address,
        Country = p_Country,
        DepartmentID = p_DepartmentID,
        JobTitleID = p_JobTitleID,
        PayGradeID = p_PayGradeID,
        EmploymentStatusID = p_EmploymentStatusID,
        SupervisorID = p_SupervisorID
    WHERE
        EmployeeID = p_EmployeeID;

    -- Update the user account information
    UPDATE useraccount
    SET
        Username = p_Username,
        Email = p_Email,
        UserAccountLevelID = p_UserAccountLevelID
    WHERE
        UserID = p_UserID AND EmployeeID = p_EmployeeID;

    -- Update or insert dependent information
    IF NOT (p_DependentName = '') THEN
		UPDATE dependentInfo
		SET
			DependentName = p_DependentName,
			DependentAge = p_DependentAge
		WHERE
			EmployeeID = p_EmployeeID;
	END IF;

END //

DELIMITER ;

-- Add new employees

DELIMITER //

CREATE PROCEDURE RegisterEmployeeAndRelatedData(
    IN p_EmployeeID VARCHAR(10),
    IN p_EmployeeName VARCHAR(40),
    IN p_DateOfBirth DATE,
    IN p_Gender enum('Male','Female'),
    IN p_MaritalStatus enum('Married','Unmarried'),
    IN p_Address varchar(2000),
    IN p_Country VARCHAR(20),
    IN p_DepartmentID varchar(10),
    IN p_JobTitleID decimal(10,0),
    IN p_PayGradeID decimal(10,0),
    IN p_EmploymentStatusID decimal(10,0),
    IN p_SupervisorID VARCHAR(10),
    IN p_UserAccountLevelName varchar(32),
    IN p_UserID decimal(10,0),
    IN p_Username varchar(32),
    IN p_Email varchar(64),
    IN p_PasswordHash varchar(100),
    IN p_DependentName VARCHAR(20),
    IN p_DependentAge decimal(10,0),
    IN p_PrimaryName VARCHAR(30),
    IN p_PrimaryPhoneNumber VARCHAR(20),
    IN p_SecondaryName VARCHAR(30),
    IN p_SecondaryPhoneNumber VARCHAR(20),
    IN p_emergencyAddress VARCHAR(100)
)
BEGIN

	DECLARE v_emergencyID INT;
    DECLARE v_userAccountLevelID varchar(32);
    
    -- Add emergency contact information
    INSERT INTO emergencyContact(PrimaryName, PrimaryPhoneNumber, SecondaryName, SecondaryPhoneNumber, Address)
	VALUES (p_PrimaryName, p_PrimaryPhoneNumber, p_SecondaryName, p_SecondaryPhoneNumber, p_emergencyAddress);
    
    SELECT EmergencyContactID INTO v_emergencyID
    FROM EmergencyContact
    ORDER BY EmergencyContactID DESC
    LIMIT 1;
    
    -- add employee data
    INSERT INTO employee(EmployeeID, EmployeeName, DateOfBirth, Gender, MaritalStatus, Address, Country, DepartmentID, JobTitleID, PayGradeID, EmploymentStatusID, SupervisorID, EmergencyContactID)
	VALUES (p_EmployeeID, p_EmployeeName, p_DateOfBirth, p_Gender, p_MaritalStatus, p_Address, p_Country, p_DepartmentID, p_JobTitleID, p_PayGradeID, p_EmploymentStatusID, p_SupervisorID, v_emergencyID);

    -- Update the user account information
    SELECT UserAccountLevelID INTO v_userAccountLevelID
    FROM useraccountlevel
    WHERE UserAccountLevelName=p_UserAccountLevelName;
    
    INSERT INTO useraccount(UserID, Username, Email, EmployeeID, PasswordHash, UserAccountLevelID)
    VALUES (p_UserID, p_Username, p_Email, p_EmployeeID, p_PasswordHash, v_userAccountLevelID);

    -- Update or insert dependent information
    IF not (p_DependentName = '') THEN
		INSERT INTO dependentinfo(EmployeeID,DependentName,DependentAge)
		VALUES(p_EmployeeID, p_DependentName, p_DependentAge);
	END IF;

END //

DELIMITER ;