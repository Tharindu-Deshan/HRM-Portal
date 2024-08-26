const{

} = require("./absense.service");

module.exports={
    getReqLeaveSub: async (req, res) => { //Req Leave Sub - done
        console.log(">getReqLeaveSub");
        // const departments = await getDepartments();
        // const supervisors = await getSupervisors();
        // const jobTitles = await getJobTitles();
        // const countries = await getCountries();
        // const EmployeeStatuses = await getEmployeeStatus();
        // const PayGrades = await getPayGrades();
        try {
            return res.json({
                success:0
            });
        } catch (error) {
            console.error("Actual error:", error); // Log the actual error
            return res.status(500).json({
                error: "An error occurred while fetching users"
            });
        }
    }
};