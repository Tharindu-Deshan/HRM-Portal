import { Container, TextField, Typography,Button, Snackbar } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { CheckCircleOutline, DoNotDisturb } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";

const LeaveApproval = () => {

    const [leaveData, setLeaveData] = useState({});
    const [cookies] = useCookies(['x-uData']);

    const location = useLocation();
    const navigate = useNavigate();

    const uData = jwt(cookies['x-uData']);

    useEffect(() => {
        console.log(location.state);
        document.title = 'Leave Approval | HRM-Portal';

        // fetch data with leaveId = location.state.id
        const data = {
            name: location.state.EmployeeName,
            jobTitle: location.state.JobTitleName,
            department: location.state.DepartmentName,
            payGrade: location.state.PayGradeName,
            totalLeaves: 50,
            leavesTaken: location.state.TotApprovedLeaveCount,
            leavesLeft: 50 - location.state.TotApprovedLeaveCount,
            reason: location.state.Reason,
            leaveType: location.state.LeaveType,
            fromDate: dayjs(location.state.FirstAbsentDate).format('YYYY-MM-DD'),
            toDate: dayjs(location.state.LastAbsentDate).format('YYYY-MM-DD'),
            noOfDays: location.state.LeaveDayCount,
        }

        setLeaveData(data);

    },[]);

    const sendApproveData = (url, type) => {
        axios.patch(url,{
            "LeaveID": location.state.LeaveID,
            "EmployeeID": location.state.EmployeeID,
            "ApprovedByID":uData.EmployeeID,
            "ApprovedDateTime":dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
        .then(res => {
            // console.log(res);
            const snackMsg = "Leave " + type + "ed successfully";
            navigate('/dashboard/manage-leaves', {state: {snackMsg: snackMsg}});
        })
        .catch(err => {
            console.log(err);
        });
    }

    const handleApprove = () => {
        sendApproveData('http://localhost:3000/api/users/approveLeaves', 'approv');
        
    }

    const handleDeny = () => {
        sendApproveData('http://localhost:3000/api/users/denyLeaves', 'deny');
        
    }


    return ( 
        <Container sx={{marginY:2}} maxWidth={'md'}>
            <Grid
                container
                spacing={2}
                justifyContent={'center'}
                sx={{border:1, borderColor:'grey.500', borderRadius:2, padding:2}}
            >
                <Grid item xs={12}>
                    <Typography variant="h5">Approve/Deny</Typography>
                    <Typography variant="caption" marginBottom={2}>You can approve or deny a request</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="name"
                        InputProps={{readOnly: true}}
                        label="Name"
                        variant="standard"
                        fullWidth
                        value={leaveData.name}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="job-title"
                        InputProps={{readOnly: true}}
                        label="Job Title"
                        variant="standard"
                        fullWidth
                        value={leaveData.jobTitle}
                    />
                </Grid>                    
                <Grid item xs={4}>
                    <TextField
                        id="department"
                        InputProps={{readOnly: true}}
                        label="Department"
                        variant="standard"
                        fullWidth
                        value={leaveData.department}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent={'center'}
                        marginTop={1}
                    >
                        <Grid item xs={3} textAlign={'center'}>
                            <Typography variant="h4">{leaveData.payGrade}</Typography>
                            <Typography variant="caption">Pay Grade</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign={'center'}>
                            <Typography variant="h4">{leaveData.totalLeaves}</Typography>
                            <Typography variant="caption">Total Leaves</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign={'center'}>
                            <Typography variant="h4">{leaveData.leavesTaken}</Typography>
                            <Typography variant="caption">Leaves Taken</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign={'center'}>
                            <Typography variant="h4">{leaveData.leavesLeft}</Typography>
                            <Typography variant="caption">Leaves Left</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="reason"
                        InputProps={{readOnly: true}}
                        label="Reason"
                        variant="standard"
                        fullWidth
                        multiline
                        rows={2}
                        value={leaveData.reason}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id=";ease-type"
                        InputProps={{readOnly: true}}
                        label="Leave Type"
                        variant="standard"
                        fullWidth
                        value={leaveData.leaveType}
                    >
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="no-of-days"
                        InputProps={{readOnly: true}}
                        label="No. of Days"
                        variant="standard"
                        fullWidth
                        value={leaveData.noOfDays}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="from-date"
                        InputProps={{readOnly: true}}
                        label="From"
                        variant="standard"
                        fullWidth
                        value={leaveData.fromDate}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="end-date"
                        InputProps={{readOnly: true}}
                        label="To"
                        variant="standard"
                        fullWidth
                        value={leaveData.toDate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption">Current Date: {dayjs().toString()}</Typography>
                </Grid>
                <Grid item xs={6} marginTop={4}>
                    <Button
                        variant="outlined"
                        fullWidth
                        color='error'
                        endIcon={<DoNotDisturb/>}
                        onClick={handleDeny}
                    >
                        Deny
                    </Button>
                </Grid>
                <Grid item xs={6} marginTop={4}>
                    <Button
                        variant="contained"
                        fullWidth
                        endIcon={<CheckCircleOutline/>}
                        onClick={handleApprove}
                    >
                        Approve
                    </Button>
                </Grid>
            </Grid>
        </Container>
     );
}
 
export default LeaveApproval;