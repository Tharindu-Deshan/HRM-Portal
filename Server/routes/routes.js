const{
    createUser,
    getUserByUserID,
    getUsers,
    updateUsers,
    deleteUser,

    login,

    register,
    getRegisterSub,
    addCustomAttribute,

    myAccount,
    editUserCredentials,
    editMyAccount,

    reqALeave,
    getReqLeaveSub,

    homeSub,

    getNotApprovedLeaves,
    approveLeaves,
    denyLeaves,

    supervisees,
    editSupervisees
}=require("../api/users/user.controller");

const{
    reports,
    getCustomAttributes
}=require("../api/reportModule/report.controller");

const router=require("express").Router();
const {checkToken}=require("../auth/token_validation");

// router.post("/",checkToken,createUser);
// router.get("/",checkToken,getUsers);
// router.get("/:id",checkToken,getUserByUserID);
// router.patch("/",checkToken,updateUsers);
// router.delete("/",checkToken,deleteUser);
// router.post("/login",login); //done
// router.post("/add_employee",add)

// router.post("/",createUser);
// router.get("/:id",getUserByUserID);
// router.patch("/",updateUsers);
// router.delete("/",deleteUser);
// ////////////////////////
router.post("/login",login); //user login

router.post("/reg",register); //add employee (user account also will be added)
router.get("/getRegisterSub",getRegisterSub); //get additional information from database 
router.post("/addCustomAttribute",addCustomAttribute) //define new custom employee attribute

router.post("/myAccount",myAccount); //employee personal account
router.patch("/editUserCredentials",editUserCredentials); //change userpassword
router.put("/editMyAccount",editMyAccount); //update my account

router.get("/",getUsers); //get Users

// // -------------------
router.post("/getReqLeaveSub",getReqLeaveSub); //getTotalLeaveCountByUSerID

router.post("/reqALeave",reqALeave); //request a leave

router.post("/homeSub",homeSub); //get required details for home page

router.get("/getNotApprovedLeaves",getNotApprovedLeaves);//get Leaves not approved yet
router.patch("/approveLeaves",approveLeaves); //approve leaves 
router.patch("/denyLeaves",denyLeaves); //deny leaves

router.post("/supervisees",supervisees); //get my supervisees
router.put("/editSupervisees",editSupervisees); //edit my supervisees

router.post("/reports",reports) //get reports
router.get("/getCustomAttributes",getCustomAttributes);//get employees custom attributes

module.exports=router;
