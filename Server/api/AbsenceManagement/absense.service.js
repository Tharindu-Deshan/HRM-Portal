const pool=require("../../db/database");

//LEAVE REALATED FUNCTIONALITES
module.exports={
    getLeavesByEmployeeID:(data,callBack)=>{
        pool.query(
            `SELECT * from leave WHERE EmployeeID=?`,
            [data.EmployeeID],
            (error,results,fields)=>{
                if(error) return callBack(error);
                return callBack(null,results);
            }
        );
    },
    getPayGradeByPayGradeID:(data,callBack)=>{
        pool.query(
            `SELECT * from paygrade WHERE PayGradeID=?`,
            [data.PayGradeID],
            (error,results,fields)=>{
                if(error) return callBack(error);
                return callBack(null,results);
            }
        )
    },
    getLeaveRequests:(data,callBack)=>{  //for approved-->data=1 notapproved-->data=0
        pool.query(
            `SELECT * from leave WHERE Approved=?`,
            [data[0]],
            (error,results,fields)=>{
                if(error) return callBack(error);
                return callBack(null,results);
            }
        )
    },
    addLeave:(data,callBack)=>{ //add a leaveinto database
        pool.query(
            `insert into leave(LeaveLogDateTime,EmployeeID,Approved,Reason,LeaveType,FirstAbsentDate,LastAbsentDate,LeaveDayCount) values(?,?,?,?,?,?,?,?)`,
            [
                data.LeaveLogDateTime,
                data.EmployeeID,   //at the runtime ? will be repalce from these values
                data.Approved,
                data.Reason,
                data.LeaveType,
                data.FirstAbsentDate,
                data.LastAbsentDate,
                data.LeaveDayCount,
            ],
            (error,results,fields)=>{
                if(error){
                    return callBack(error);
                }
                return callBack(null,results);
            }
        );
    },
    
};