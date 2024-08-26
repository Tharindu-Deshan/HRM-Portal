import { Avatar, Box, Card, CardContent, CardMedia, Container, Grid, Skeleton, Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt from 'jwt-decode';
import axios from "axios";

const sign = require('jwt-encode');
const secret = 'secret';

const Home = () => {

    const [cookies, updateCookies] = useCookies(['u-token', 'x-uData']);
    const [isLoading, setIsLoading] = useState(true);

    const [noOfLeaves, setNoOfLeaves] = useState({
        Annual: 0,
        Casual: 0,
        Maternity: 0,
        NoPay: 0
    });
    const [empDetails, setEmpDetails] = useState({});
    const [totalLeavesTaken, setTotalLeavesTaken] = useState(0);

    useEffect(() => {
        document.title = 'Home | HRM-Portal';

        const xUdata = jwt(cookies['x-uData']);
        console.log(xUdata);

        setIsLoading(true);
        //fetch data
        const leavesData = {
            Annual: 0,
            Casual: 0,
            Maternity: 0,
            NoPay: 0
        }; 
        setNoOfLeaves(leavesData);
        
        const decoded = jwt(cookies['u-token']);
        // console.log(decoded.result[0].EmployeeID);

        setEmpDetails({
            name: decoded.result[0].Username,
            employeeId: xUdata.EmployeeID,
            status: 'Permanent',
            payGrade: 'Lv1',
            company: 'Jupiter Apparels (Pvt) Ltd',
            branch: 'Colombo Branch',
            country: 'Sri Lanka'
        });

        axios.post('http://localhost:3000/api/users/homeSub',{
            "userID": xUdata.UserID,
            "EmployeeID": xUdata.EmployeeID
        })
        .then(res => {
            console.log(res.data);
            setEmpDetails({
                name: res.data.PersonalInfoForHome.Username,
                employeeId: res.data.PersonalInfoForHome.EmployeeID,
                status: res.data.EmployeeStatusInfo[0].EmploymentStatusName,
                payGrade: 'Lv' + res.data.PayGradesInfo[0].PayGradeName[6],
                company: 'Jupiter Apparels (Pvt) Ltd',
                branch: 'Colombo Branch',
                country: 'Sri Lanka'
            });

            setTotalLeavesTaken(res.data.TotApprovedLeaveCount[0].totApprovedLeaveCount);

            const leavesData = res.data.TotApprovedLeaveCountByType;

            leavesData.forEach(l => {
                if(l.LeaveType === 'Annual'){
                    setNoOfLeaves(prevState => ({
                        ...prevState,
                        Annual: l.CountApprovedByType
                    }));
                }else if(l.LeaveType === 'Casual'){
                    setNoOfLeaves(prevState => ({
                        ...prevState,
                        Casual: l.CountApprovedByType
                    }));
                }else if(l.LeaveType === 'Maternity'){
                    setNoOfLeaves(prevState => ({
                        ...prevState,
                        Maternity: l.CountApprovedByType
                    }));
                }else if(l.LeaveType === 'No-Pay'){
                    setNoOfLeaves(prevState => ({
                        ...prevState,
                        NoPay: l.CountApprovedByType
                    }));
                }
            });
            let uData = jwt(cookies['x-uData']);
            uData = {...uData, TotalLeavesTaken: res.data.TotApprovedLeaveCount[0].totApprovedLeaveCount};
            let jwtData = sign(uData, secret);
            updateCookies('x-uData', jwtData, { path: '/' , expires: new Date(Date.now() + 3600000)});
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            setIsLoading(false);
        });

    },[]);

    return ( 
        <Container>

            { isLoading && (
                <>
                <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Skeleton variant="circular" width={250} height={250} sx={{m:'auto'}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Skeleton variant="rectangular" width={'100%'} height={250} />
                    </Grid>
                    <Grid item xs={6}>
                        <Skeleton variant="rectangular" width={'100%'} height={160} />
                    </Grid>
                    <Grid item xs={6}>
                        <Skeleton variant="rectangular" width={'100%'} height={160} />
                    </Grid>
                    <Grid item xs={8}>
                        <Skeleton variant="rectangular" width={'100%'} height={160} />
                    </Grid>
                    <Grid item xs={4}>
                        <Skeleton variant="rectangular" width={'100%'} height={160} />
                    </Grid>
                </Grid>
            </>
            )}

            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Hello There!
                    </Typography>
                    <Typography variant="body2" component="div">
                        It's a good day to work!
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h5" component="div">
                        {empDetails.name}
                    </Typography>
                    <Typography variant="body2" component="div" textAlign={'right'}>
                        {empDetails.employeeId}
                    </Typography>
                </Box>
                <Avatar alt="John Doe" src="/userIcon.jpg" sx={{ width: 72, height: 72, ml:3 }} />

            </Toolbar>
            <Grid container spacing={2} marginTop={2}>
                <Grid item md={12} lg={6} paddingX={4}>
                    <PieChart
                        //shades of blue
                        colors={['#2196f3', '#1976d2', '#0d47a1', '#82b1ff', '#e3f2fd']}
                        series={[
                            {
                            data: [
                                //enum('Annual','Casual','Maternity','No-Pay')
                                { id: 0, value: noOfLeaves.Annual, label: 'Annual' },
                                { id: 1, value: noOfLeaves.Casual, label: 'Casual' },
                                { id: 2, value: noOfLeaves.Maternity, label: 'Maternity' },
                                { id: 3, value: noOfLeaves.NoPay, label: 'No-Pay' },
                                { id: 4, value: 50-totalLeavesTaken, label: 'Leaves Left'}
                            ],
                            innerRadius: 60,
                            outerRadius: 150,
                            paddingAngle: 4,
                            cornerRadius: 5,
                            startAngle: -90,
                            endAngle: 270,
                            cx: 150,
                            cy: 150
                            },
                        ]}
                        fullWidth
                        height={400}
                    />
                </Grid>
                <Grid item md={12} lg={6}>
                    <Grid container spacing={2} alignItems={'center'} height={'100%'}>
                        <Grid item xs={12}>
                            <Grid
                            container
                            spacing={2}
                            justifyContent={'center'}
                            sx={{border:1, borderColor:'grey.400', borderRadius:2, padding:2}}
                            >
                                <Grid item xs={4} textAlign={'center'}>
                                    <Typography variant="h4">50</Typography>
                                    <Typography variant="caption">Total Leaves</Typography>
                                </Grid>
                                <Grid item xs={4} textAlign={'center'}>
                                    <Typography variant="h4">{totalLeavesTaken}</Typography>
                                    <Typography variant="caption">Leaves Taken</Typography>
                                </Grid>
                                <Grid item xs={4} textAlign={'center'}>
                                    <Typography variant="h4">{50-totalLeavesTaken}</Typography>
                                    <Typography variant="caption">Leaves Left</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid
                            container
                            spacing={2}
                            justifyContent={'center'}
                            sx={{border:1, borderColor:'grey.400', borderRadius:2, padding:2}}
                            >
                                <Grid item xs={8} textAlign={'center'}>
                                    <Typography variant="h4">{empDetails.status}</Typography>
                                    <Typography variant="caption">Employee Status</Typography>
                                </Grid>
                                <Grid item xs={4} textAlign={'center'}>
                                    <Typography variant="h4">{empDetails.payGrade}</Typography>
                                    <Typography variant="caption">Pay Grade</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Card elevation={0}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {empDetails.company}
                            </Typography>
                            <Typography variant="body2">
                                {empDetails.branch}
                            </Typography>
                            <Typography variant="body2">
                                {empDetails.country}
                            </Typography>
                            <Typography variant="body2">
                                {empDetails.company} is a leading apparel manufacturer in Sri Lanka.
                                Here we are using HRM-Portal to manage our employees. This is a demo application.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Card elevation={0}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/company.jpg"
                            alt="Jupiter Apparels (Pvt) Ltd"
                        />
                    </Card>
                </Grid>
            </Grid>
        </Container>
     );
}
 
export default Home;