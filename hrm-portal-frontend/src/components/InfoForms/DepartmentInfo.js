import { EditOutlined } from "@mui/icons-material";
import { Container, IconButton, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";
import axios from "axios";

const DepartmentInfo = ({data, isReadOnly, getData}) => {

    
    const [departmentTypes, setDepartmentTypes] = useState([]);
    const [jobStatusTypes, setJobStatusTypes] = useState([]);
    const [supervisorList, setSupervisorList] = useState([]);
    const [payGradeTypes, setPayGradeTypes] = useState([]);
    const [jobTitleTypes, setJobTitleTypes] = useState([]);

    const [jobTitle, setJobTitle] = useState('Software Engineer');
    const [department, setDepartment] = useState('IT');
    const [status, setStatus] = useState('Intern (fulltime)');
    const [payGrade, setPayGrade] = useState('Level1');
    const [supervisor, setSupervisor] = useState('');

    useEffect(() => {
        // fetching initial data
        axios.get("http://localhost:3000/api/users/getRegisterSub")
        .then(res=> {
            // console.log(res.data);
            setDepartmentTypes([]);
            setJobStatusTypes([]);
            setSupervisorList([]);
            setPayGradeTypes([]);
            setJobTitleTypes([]);

            for(let i=0; i<res.data.departments.length; i++){
                // loading department types to the select box
                setDepartmentTypes(departmentTypes => [...departmentTypes, {value: res.data.departments[i].DepartmentName, label: res.data.departments[i].DepartmentName}]);
            }

            for(let i=0; i<res.data.EmployeeStatuses.length; i++){
                // loading job status types to the select box
                setJobStatusTypes(jobStatusTypes => [...jobStatusTypes, {value: res.data.EmployeeStatuses[i].EmploymentStatusName, label: res.data.EmployeeStatuses[i].EmploymentStatusName}]);
            }

            for(let i=0; i<res.data.supervisors.length; i++){
                // loading supervisor list to the select box
                setSupervisorList(supervisorList => [...supervisorList, {value: res.data.supervisors[i].EmployeeName, label: res.data.supervisors[i].EmployeeName}]);
                // setSupervisor(res.data.supervisors[0].EmployeeName);
            }

            for(let i=0; i<res.data.PayGrades.length; i++){
                // loading pay grade types to the select box
                setPayGradeTypes(payGradeTypes => [...payGradeTypes, {value: res.data.PayGrades[i].PayGradeName, label: res.data.PayGrades[i].PayGradeName}]);
            }
            setPayGrade(res.data.PayGrades[0].PayGradeName);

            for(let i=0; i<res.data.jobTitles.length; i++){
                // loading job title types to the select box
                setJobTitleTypes(jobTitleTypes => [...jobTitleTypes, {value: res.data.jobTitles[i].JobTitleName, label: res.data.jobTitles[i].JobTitleName}]);
            }

        }).catch(err=>{
            console.log("Axios get error");
        }).finally(()=>{
            // console.log("final");
        });
        
        if(isReadOnly){
            setJobTitle(data && data.departmentInfo.jobTitle || '');
            setDepartment(data && data.departmentInfo.department || '');
            setStatus(data && data.departmentInfo.status || '');
            setPayGrade(data && data.departmentInfo.payGrade || '');
            setSupervisor(data && data.departmentInfo.supervisor || '');
        }else{
            let formData = {jobTitle, department, status, payGrade, supervisor};
            if(isFormDataValid()){
                getData(formData);
            }else{
                getData(null);
            }
        }
    } , [isReadOnly, data, jobTitle, department, status, payGrade, supervisor]);

    const isFormDataValid = () => {
        
        return (
            jobTitle !== '' &&
            department !== '' &&
            status !== '' &&
            payGrade !== '' &&
            supervisor !== ''
        );
    };

    return (
        <Container sx={{marginY:2, border:1, borderColor:'grey.400', borderRadius:2, padding:4}}>
            <Typography variant="h6" marginBottom={2}>Department Information</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    id="job-title"
                    label="Job Title"
                    variant="standard"
                    fullWidth
                    required
                    select
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={jobTitle}
                    {...(isReadOnly ? {} : {onChange: (e) => setJobTitle(e.target.value)})}
                >
                    {jobTitleTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="department"
                    label="Department"
                    variant="standard"
                    fullWidth
                    required
                    select
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={department}
                    {...(isReadOnly ? {} : {onChange: (e) => setDepartment(e.target.value)})}
                >
                    {departmentTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="status"
                    label="Status"
                    variant="standard"
                    fullWidth
                    required
                    select
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={status}
                    {...(isReadOnly ? {} : {onChange: (e) => setStatus(e.target.value)})}
                >
                    {jobStatusTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="pay-grade"
                    label="Pay Grade"
                    variant="standard"
                    fullWidth
                    required
                    select
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={payGrade}
                    {...(isReadOnly ? {} : {onChange: (e) => setPayGrade(e.target.value)})}
                >
                    {payGradeTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="supervisor"
                    label="Supervisor"
                    variant="standard"
                    fullWidth
                    required
                    select
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={supervisor}
                    {...(isReadOnly ? {} : {onChange: (e) => setSupervisor(e.target.value)})}
                >
                    {supervisorList.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Grid>
        </Grid>
        </Container>
    );
}

export default DepartmentInfo;
