import { Box, Button, ButtonGroup, Container, Grid, Skeleton, Tab, TextField, Typography } from "@mui/material";
import axios from "axios";
import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";


const columns = [
    { field: 'EmployeeID', headerName: 'ID', width: 100 },
    { field: 'EmployeeName', headerName: 'Name', width: 210 },
    { field: 'Gender', headerName: 'Gender', width: 100 },
    { field: 'JobTitleName', headerName: 'Job Title', width: 190 },
    { field: 'DepartmentName', headerName: 'Department', width: 180 },
    { field: 'PayGradeName', headerName: 'Pay Grade', width: 120 },
    { field: 'SupervisorName', headerName: 'Supervisor', width: 200 }
  ];


const Reports = () => {

    const [report1Data, setReport1Data] = useState([]);
    
    const [report2Data, setReport2Data] = useState([]);

    const [fromDateForR2, setFromDateForR2] = useState(dayjs('2022-10-29'));
    const [toDateForR2, setToDateForR2] = useState(dayjs('2023-11-30'));
    const [btnAvailableForR2, setBtnAvailableForR2] = useState(true);
    
    const [report3Data, setReport3Data] = useState(null);
    
    const [report4Data, setReport4Data] = useState([]);
    const [attributeList, setAttributeList] = useState([]);
    const [selectedAttribute, setSelectedAttribute] = useState('');

    const [report5Data, setReport5Data] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState('1');

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    
    const handleReport1 = () => {
        console.log('Report 1');
        axios.post('http://localhost:3000/api/users/reports',{
            "reportNO":1
        })
        .then((response) => {
            console.log(response.data.data);
            setReport1Data(response.data.data);
            console.log(report1Data);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    const handleReport2 = () => {
        console.log('Report 2');
        setBtnAvailableForR2(false);

        if(dayjs(fromDateForR2).isAfter(toDateForR2)){
            alert('From date should be less than To date');
            setBtnAvailableForR2(true);
            return;
        }

        axios.post('http://localhost:3000/api/users/reports',{
            "reportNO":2,
            "From": dayjs(fromDateForR2).format('YYYY-MM-DD'),
            "To": dayjs(toDateForR2).format('YYYY-MM-DD')
        })
        .then((response) => {
            console.log(response.data.data);
            setReport2Data(response.data.data);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setBtnAvailableForR2(true);
        })
    };

    const handleReport3 = () => {
        console.log('Report 3');
        axios.post('http://localhost:3000/api/users/reports',{
            "reportNO":3
        })
        .then((response) => {
            console.log(response.data.data1);
            setReport3Data(response.data);
            console.log(report3Data);
        })
    };

    const handleReport4 = (attribute) => {
        console.log('Report 4');
        axios.post('http://localhost:3000/api/users/reports',{
            "reportNO":4,
            "AttributeName": attribute
        })
        .then((response) => {
            console.log(response.data.data);
            setReport4Data(response.data.data);
        });
    };

    const handleReport5 = () => {
        console.log('Report 5');
        axios.post('http://localhost:3000/api/users/reports',{
            "reportNO":5
        })
        .then(res => {
            console.log(res.data);
            
            let data = [];
            for (let i = 0; i < res.data.data.length; i++) {
                data.push({
                id: i+1,
                EmployeeID: res.data.data[i].EmployeeID,
                EmployeeName: res.data.data[i].EmployeeName,
                Gender: res.data.data[i].Gender,
                JobTitleName: res.data.data[i].JobTitleName,
                DepartmentName: res.data.data[i].DepartmentName,
                PayGradeName: res.data.data[i].PayGradeName,
                SupervisorName: res.data.data[i].SupervisorName
                });
            }
            console.log(data);
            setReport5Data(data);
            console.log(report5Data);

        })
        .catch(err => {
        console.log(err);
        })
        .finally(() => {
        setIsLoading(false);
        });
    }

    useEffect(() => {
        try{
            handleReport1();
            handleReport2();
            handleReport3();
            handleReport5();

            axios.get('http://localhost:3000/api/users/getCustomAttributes')
            .then((response) => {
                console.log(response.data);
                const data = [];
                for (let i = 0; i < response.data.length; i++) {
                    data.push(response.data[i].AttributeName);
                }
                setAttributeList(data);
                setSelectedAttribute(data[0]);
                handleReport4(data[0]);
            })
        }
        catch(err){
            console.log(err);
        }
    }, []);

    return ( 
        <Container>

            {/* <ButtonGroup variant="text">
                <Button onClick={handleReport1}>Report 1</Button>
                <Button onClick={handleReport2}>Report 2</Button>
                <Button onClick={handleReport3}>Report 3</Button>
                <Button onClick={()=>{console.log(attributeList)}}>Report 4</Button>
            </ButtonGroup> */}

            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Number of Employees by department" value="1" />
                    <Tab label="Total leaves in the given period" value="2" />
                    <Tab label="Summary" value="3" />
                    <Tab label="Custom Attribute Reports" value="4" />
                    <Tab label="All Employees" value="5" />
                </TabList>
                </Box>
                <TabPanel value="1">
                    {report1Data.length > 0 && (
                        <>
                            <Typography variant="h6" marginTop={2}>
                                Number of Employees by department
                            </Typography>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: report1Data.map((item)=>{return item.DepartmentName}) }]}
                                series={[{ type: 'bar', data: report1Data.map((item)=>{return item.EmployeeCount}) }]}
                                width={960}
                                height={500}
                                colors={['#82b1ff']}
                            />
                        </>
                    )}
                </TabPanel>
                {/* ################################################################################################### */}
                <TabPanel value="2">
                    <Typography variant="h6" marginTop={2} gutterBottom>
                        Total leaves in the period
                    </Typography>
                    <br />
                    <Box sx={{paddingX:6, display:'flex'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="From"
                                value={fromDateForR2}
                                onChange={(newValue) => {
                                    setFromDateForR2(newValue);
                                }}
                            />
                            <DatePicker
                                label="To"
                                value={toDateForR2}
                                onChange={(newValue) => {
                                    setToDateForR2(newValue);
                                }}
                                sx={{mx:2}}
                            />
                            <Button variant="outlined" onClick={handleReport2} sx={{paddingX:6}} disabled={!btnAvailableForR2}>Generate</Button>
                        </LocalizationProvider>
                    </Box>
                    {report2Data.length > 0 ? (
                        <>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: report2Data.map((item)=>{return item.DepartmentName}) }]}
                                series={[{ type: 'bar', data: report2Data.map((item)=>{return item.LeaveCount}) }]}
                                width={960}
                                height={480}
                                colors={['#82b1ff']}
                            />
                        </>
                    ):(
                        <Typography variant="body">
                            <br />No leave data to show!
                        </Typography>
                    )}
                </TabPanel>
                {/* ################################################################################################### */}
                <TabPanel value="3">
                    {(report3Data != null && report3Data.data1.length > 0) ? (
                        <Grid container textAlign={'center'}>
                            {/* <Grid item xs={6}>
                                <Typography variant="h6" marginY={2}>
                                    Number of Employees by department
                                </Typography>
                                <BarChart
                                    xAxis={[{ scaleType: 'band', data: report3Data.data1.map((item)=>{return item.DepartmentName}) }]}
                                    series={[{ type: 'bar', data: report3Data.data1.map((item)=>{return item.EmployeeCount}) }]}
                                    width={500}
                                    height={300}
                                    colors={['#82b1ff']}
                                />
                            </Grid> */}
                            
                            {/* <Grid item xs={12}>
                                <Typography variant="h6" marginTop={2}>
                                    Number of Employees by Job Title
                                </Typography>
                            </Grid> */}
                            <Grid item xs={6}>
                                <Typography variant="h6" marginTop={2}>
                                    Number of Employees by Job Title
                                </Typography>
                                <BarChart
                                    xAxis={[{ scaleType: 'band', data: report3Data.data2.map((item)=>{return item.JobTitleName}) }]}
                                    series={[{ type: 'bar', data: report3Data.data2.map((item)=>{return item.EmployeeCount}) }]}
                                    width={500}
                                    height={300}
                                    colors={['#82b1ff']}
                                />
                            </Grid>
                            
                            {/* <Grid item xs={12}>
                                <Typography variant="h6" marginTop={2}>
                                    Number of Employees by Pay Grade
                                </Typography>
                            </Grid> */}
                            <Grid item xs={6}>
                                <Typography variant="h6" marginTop={2}>
                                    Number of Employees by Pay Grade
                                </Typography>
                                <BarChart
                                    xAxis={[{ scaleType: 'band', data: report3Data.data3.map((item)=>{return item.PayGradeName}) }]}
                                    series={[{ type: 'bar', data: report3Data.data3.map((item)=>{return item.EmployeeCount}) }]}
                                    width={500}
                                    height={300}
                                    colors={['#82b1ff']}
                                />
                            </Grid>
                        </Grid>
                    ):(
                        <>
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                        </>
                    )}
                </TabPanel>
                {/* ################################################################################################### */}
                <TabPanel value="4">
                    { (attributeList.length != 0) ?
                        (
                            <Box sx={{paddingX:6, display:'flex'}}>
                                <Typography variant="h6">
                                    Select a custom attribute
                                </Typography>
                                <TextField 
                                    select
                                    label="Custom Attribute"
                                    variant="outlined"
                                    SelectProps={
                                        {native:true}
                                    }
                                    sx={{flexGrow:1, marginLeft:2}}
                                    onChange={(event)=>{
                                        setSelectedAttribute(event.target.value);
                                        handleReport4(event.target.value);
                                    }}
                                    value={selectedAttribute}
                                    >
                                    {attributeList.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                            </Box>
                        ):(
                            <Box sx={{paddingX:6, display:'flex'}}>
                                <Typography variant="h6">
                                    No Attributes to Show!
                                </Typography>
                            </Box>
                        )
                    }
                    <br />
                    {(report4Data != null && report4Data.length > 0) ? (
                        <BarChart
                        xAxis={[{ scaleType: 'band', data: report4Data.map((item)=>{return item.AttributeValue}) }]}
                        series={[{ type: 'bar', data: report4Data.map((item)=>{return item.EmployeeCount}) }]}
                        width={500}
                        height={300}
                        colors={['#82b1ff']}
                    />
                    ):(
                        <>
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                        </>
                    )}
                    
                </TabPanel>
                <TabPanel value="5">
                    <DataGrid
                        rows={report5Data}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                        }}
                        pageSizeOptions={[10, 15]}
                    />
                </TabPanel>
            </TabContext>


            {isLoading && (
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
        </Container>
     );
}
 
export default Reports;