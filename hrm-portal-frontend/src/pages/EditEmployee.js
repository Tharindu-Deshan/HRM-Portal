import { Box, Button, IconButton } from "@mui/material";
import PersonalInfo from "../components/InfoForms/PersonalInfo";
import DepartmentInfo from "../components/InfoForms/DepartmentInfo";
import EmergencyInfo from "../components/InfoForms/EmergencyInfo";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CloseOutlined, EditOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import CustomAttribute from "../components/InfoForms/CustomAttribute";

const EditEmployee = () => {

    const [data, setData] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [myData, setMyData] = useState({});
    const location = useLocation();
    const [oldCustomAttributes, setOldCustomAttributes] = useState([]);
    const [newCustomAttributes, setNewCustomAttributes] = useState([]);

    const [errorPersonalForm, setErrorPersonalForm] = useState(false);
    const [errorEmergencyForm, setErrorEmergencyForm] = useState(false);

    const navigate = useNavigate();

    const getPersonalInfo = (e) => {
        myData.personalInfo = e;
        if(!e){
            return;
        }
        myData.personalInfo = { ...e, employeeID: location.state.EmployeeID, UserID: location.state.UserID };
    };

    const getDepartmentInfo = (e) => {
        myData.departmentInfo = e;
    };

    const getEmergencyInfo = (e) => {
        myData.emergencyInfo = e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log('====submit====');

        setData(myData)
        oldCustomAttributes != null ? myData.CustomAttributesInfo = oldCustomAttributes : myData.CustomAttributesInfo = [];
        myData.newlyAddedCustomAttributesInfo = newCustomAttributes;
        
        console.log(myData);

        if(!myData.personalInfo || !myData.departmentInfo || !myData.emergencyInfo){
            if(!myData.personalInfo){
                setErrorPersonalForm(true);
                myData.personalInfo = { ...e, employeeID: location.state.EmployeeID, UserID: location.state.UserID };
            }
            if(!myData.emergencyInfo){
                setErrorEmergencyForm(true);
            }
            console.log(" field error");
            return;
        }
        setIsReadOnly(true);

        axios.put("http://localhost:3000/api/users/editSupervisees",myData)
        .then(res=>{
            // console.log(res.data.success);
            if(res.data.success===1){
                console.log("updated");
            }
        }).catch(err => {
            console.log("Axios post error");
            alert("Error Occured, Please try again!");
        }).finally(() => {
            // console.log("final");
            alert("Updated Successfully");
            navigate('/dashboard/supervisees');
            setErrorPersonalForm(false);
            setErrorEmergencyForm(false);
        });
    };

    useEffect(() => {
        document.title = "Edit Employee | HRM-Portal";
        
        const data = { EmployeeID: location.state.EmployeeID, UserID: location.state.UserID }; 
    
        axios.post('http://localhost:3000/api/users/myAccount', data)
        .then(res => {
            // console.log(res);
            if (res.status === 200 && res.data.success) {
                // console.log(res.data);
                setData({
                        "personalInfo": {
                            "name": res.data.PersonalInfo?.personalInfo?.EmployeeName || "N/A",
                            "employeeID": res.data.PersonalInfo?.personalInfo?.EmployeeID || "N/A",
                            "address": res.data.PersonalInfo?.personalInfo?.Address || "N/A",
                            "country": res.data.PersonalInfo?.personalInfo?.Country || "N/A",
                            "username": res.data.PersonalInfo?.personalInfo?.Username || "N/A",
                            "email": res.data.PersonalInfo?.personalInfo?.Email || "N/A",
                            "userAccountType":res.data.UserAccountLv?.[0]?.UserAccountLevelName || "N/A",
                            "dob": dayjs(res.data.PersonalInfo?.personalInfo?.DateOfBirth).format("YYYY/MM/DD") || "N/A",
                            "maritalStatus": res.data.PersonalInfo?.personalInfo?.MaritalStatus || "N/A",
                            "gender": res.data.PersonalInfo?.personalInfo?.Gender || "N/A",
                            "dependentName": res.data.DependentInfo?.[0]?.DependentName || null,
                            "dependentAge": res.data.DependentInfo?.[0]?.DependentAge || null
                        },
                        "departmentInfo": {
                            "jobTitle": res.data.JobTitleInfo?.[0]?.JobTitleName || "N/A",
                            "department": res.data.DepartmentInfo?.[0]?.DepartmentName || "N/A",
                            "status": res.data.EmployeeStatusInfo?.[0]?.EmploymentStatusName || "N/A",
                            "payGrade": res.data.PayGradesInfo?.[0]?.PayGradeName || "N/A",
                            "supervisor": res.data.SupervisorsInfo?.SupervisorName || "N/A"
                        },
                        "emergencyInfo": {
                            "name1": res.data.EmergencyInfo?.[0]?.PrimaryName || "N/A",
                            "telNo1": res.data.EmergencyInfo?.[0]?.PrimaryPhoneNumber || "N/A",
                            "name2": res.data.EmergencyInfo?.[0]?.SecondaryName || "N/A",
                            "telNo2": res.data.EmergencyInfo?.[0]?.SecondaryPhoneNumber || "N/A",
                            "emergencyAddress": res.data.EmergencyInfo?.[0]?.Address || "N/A"
                        }
                    });
                    setOldCustomAttributes(res.data.CustomAttributesInfo);
            }
        })
        .catch(err => {
            console.log(err);
        });

    }, []);
    return ( 
            <Box maxWidth={"840px"} margin={'auto'}>
                <Box sx={{textAlign:'right'}}>
                    {
                        !isReadOnly && (
                            <Button variant="contained" sx={{paddingX:4}} onClick={handleSubmit}>
                                Save
                            </Button>
                        )
                    }
                    <IconButton
                        sx={{ marginLeft: 2, boxShadow: 1 }}
                        onClick={() => setIsReadOnly(!isReadOnly)}
                    >
                        {isReadOnly ? <EditOutlined /> : <CloseOutlined />}
                    </IconButton>
                </Box>
                <PersonalInfo data={data} isReadOnly={isReadOnly} getData={getPersonalInfo} errorInForm={errorPersonalForm}/>
                <DepartmentInfo data={data} isReadOnly={isReadOnly} getData={getDepartmentInfo}/>
                <EmergencyInfo data={data} isReadOnly={isReadOnly} getData={getEmergencyInfo} errorInForm={errorEmergencyForm}/>

                {/* custom attributes */}
                {oldCustomAttributes != null && oldCustomAttributes.map((customAttribute, index) => (
                    <CustomAttribute
                        key={index}
                        isReadOnly={isReadOnly}
                        getData={(e) => {
                            // myData[`customAttribute${index}`] = e;
                            // myData.noOfCustomAttributes = index+1;
                            oldCustomAttributes[index] = e;
                        }}
                        data={customAttribute}
                    />
                ))}
                {/* custom attributes */}
                {newCustomAttributes.map((customAttribute, index) => (
                    <CustomAttribute key={index} getData={(e) => {
                        // myData[`customAttribute${index}`] = e;
                        // myData.noOfCustomAttributes = index+1;
                        newCustomAttributes[index] = e;
                    }}/>
                ))}
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{width:'100%'}}
                    disabled={isReadOnly}
                    onClick={() => {
                        setNewCustomAttributes([...newCustomAttributes, {}]);
                    }}
                >
                    Add New Custom Attribute
                </Button>
            </Box>
     );
}
 
export default EditEmployee;