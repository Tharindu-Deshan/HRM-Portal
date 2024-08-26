
  -- ------------------------------------------------------------------------------------------------------
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
-- ---------------------------------------------------------------------------------------------------------
-- Insert sample data into the UserAccountLevel table
INSERT INTO UserAccountLevel (UserAccountLevelID, UserAccountLevelName, OwnProfileDetailsAccess, EveryProfileDetailsAccess,LeaveApproveAccess)
VALUES
  (1, 'Level4', 'EDIT', 'EDIT','EDIT'), -- admin
  (2, 'Level3', 'EDIT', 'EDIT','EDIT'), -- hr manager
  (3, 'Level2', 'VIEW', 'NO','EDIT'), -- supervisor
  (4, 'Level1', 'VIEW', 'NO','NO'); -- employee
  
  -- ---------------
  INSERT INTO PayGrade (PayGradeID, PayGradeName, AnnualLeaveCount, CasualLeaveCount, MaternityLeaveCount, PayLeaveCount)
VALUES
    (1, 'Level 1', 25, 10, 12, 5),
    (2, 'Level 2', 20, 8, 14, 6),
    (3, 'Level 3', 18, 7, 10, 4);

-- Insert job titles into the JobTitle table
INSERT INTO JobTitle (JobTitleID, JobTitleName)
VALUES
    (1, 'HR Manager'),
    (2, 'Accountant'),
    (3, 'Software Engineer'),
    (4, 'QA Engineer');

-- Insert employment status into the EmploymentStatus table
INSERT INTO EmploymentStatus (EmploymentStatusID, EmploymentStatusName)
VALUES
    (1, 'Intern (fulltime)'),
    (2, 'Intern (parttime)'),
    (3, 'Contract (fulltime)'),
    (4, 'Contract (parttime)'),
    (5, 'Permanent'),
    (6, 'Freelance');

-- Insert data into the Salary table
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
    (10, 2, 4, 2,42000);

-- ====================================================================

-- Sample data for the EmergencyContact table
INSERT INTO EmergencyContact (EmergencyContactID, PrimaryName, PrimaryPhoneNumber, SecondaryName, SecondaryPhoneNumber, Address) VALUES
(1, 'John Doe', 1234567890, 'Jane Doe', 9876543210, '789 Oak St'),
(2, 'Alice Smith', 5551234567, NULL, NULL, '456 Maple St');

-- Sample data for the Department table
INSERT INTO Department (DepartmentID, DepartmentName) VALUES
('HR', 'Human Resources'),
('IT', 'Infor Technology');


-- Sample data for the Employee table
INSERT INTO Employee (EmployeeID, EmployeeName, DateOfBirth, Gender, MaritalStatus, Address, Country, DepartmentID, JobTitleID, PayGradeID, EmploymentStatusID, SupervisorID, EmergencyContactID) VALUES
('E001', 'John Smith', '1980-01-15', 'Male', 'Married', '123 Oak St', 1, 'HR', 1, 1, 1, NULL, 1),
('E002', 'Jane Doe', '1990-05-20', 'Female', 'Unmarried', '456 Elm St', 2, 'IT', 2, 2, 2, 'E001', 2);

-- Sample data for the DependentInfo table
INSERT INTO DependentInfo (DependentInfoID, EmployeeID, DependentName, DependentAge) VALUES
(1, 'E001', 'Child 1', 24),
(2, 'E001', 'Child 2', 27),
(3, 'E002', 'Child 3', 39);


-- Sample data for the UserAccount table
INSERT INTO UserAccount (UserID, Username, EmployeeID, Email, PasswordHash, UserAccountLevelID) VALUES
(1, 'admin_user', 'E001', 'admin@gmail.com', '0000', 1),
(2, 'user1', 'E002', 'user1@gmail.com', '0000', 2);

-- Sample data for the Leave table
INSERT INTO `Leave` (LeaveID, LeaveLogDateTime, EmployeeID, Approved, Reason, LeaveType, FirstAbsentDate, LastAbsentDate, LeaveDayCount, ApprovedDateTime, ApprovedByID) VALUES
(1, '2023-04-10 09:00:00', 'E001', 1, 'Vacation', 'Annual', '2023-04-15', '2023-04-20', 6, '2023-04-12 10:00:00', 'E002'),
(2, '2023-04-15 08:00:00', 'E002', 0, 'Sick Leave', 'Casual', '2023-04-15', '2023-04-15', 1, NULL, NULL);





