import { Box, Button, Snackbar } from "@mui/material";
import PersonalInfo from "../components/InfoForms/PersonalInfo";
import DepartmentInfo from "../components/InfoForms/DepartmentInfo";
import EmergencyInfo from "../components/InfoForms/EmergencyInfo";
import CustomAttribute from "../components/InfoForms/CustomAttribute";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEmployee = ({children}) => {

    useEffect(() => {
        document.title = "Add Employee | HRM-Portal";

    }, []);

    const [customAttributes, setCustomAttributes] = useState([]);
    const [myData, setMyData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate=useNavigate();
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [errorPersonalForm, setErrorPersonalForm] = useState(false);
    const [errorEmergencyForm, setErrorEmergencyForm] = useState(false);

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
        navigate('/dashboard/home')
    };


    const getPersonalInfo = (e, validity) => {
        myData.personalInfo = e;
        if(!e){
            return;
        }
    };

    const getDepartmentInfo = (e) => {
        myData.departmentInfo = e;
    };

    const getEmergencyInfo = (e) => {
        myData.emergencyInfo = e;
    };
    ///////////////////////////////////////////
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('submit');

        myData.CustomAttributes = customAttributes;

        if(!myData.personalInfo || !myData.departmentInfo || !myData.emergencyInfo){
            if(!myData.personalInfo){
                setErrorPersonalForm(true);
            }
            if(!myData.emergencyInfo){
                setErrorEmergencyForm(true);
            }
            setIsLoading(false);
            console.log(" field error");
            return;
        }

        axios.post("http://localhost:3000/api/users/reg",myData)
        .then(res=>{
            console.log(res.data.success);
            if(res.data.success===1){
                // navigate('/dashboard/home');
                setSnackBarOpen(true);
            }
        }).catch(err => {
            console.log(err.response);
            console.log("Axios post error");
            // duplicate email
            if(err.response && err.response.data.success == -1){
                console.log("Duplicate Email");
                alert("Duplicate Email Detected!");
            }

        }).finally(() => {
            setIsLoading(false);
            setErrorPersonalForm(false);
            setErrorEmergencyForm(false);
        });

    };
    /////////////////////////////////

    const handleCancel = (e) => {
        e.preventDefault();
        console.log('cancel');
    };

    return ( 
            <Box maxWidth={"840px"} margin={'auto'}>
                <PersonalInfo getData={getPersonalInfo} errorInForm={errorPersonalForm}/>
                <DepartmentInfo getData={getDepartmentInfo}/>
                <EmergencyInfo getData={getEmergencyInfo} errorInForm={errorEmergencyForm}/>
                
                {/* custom attributes */}
                {customAttributes.map((customAttribute, index) => (
                    <CustomAttribute key={index} getData={(e) => {
                        // myData[`customAttribute${index}`] = e;
                        // myData.noOfCustomAttributes = index+1;
                        customAttributes[index] = e;
                    }}/>
                ))}
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{width:'100%'}}
                    onClick={() => {
                        setCustomAttributes([...customAttributes, {}]);
                    }}
                
                >
                    Add Custom Attribute
                </Button>

                <br/><br />
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{width:'48%'}}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{width:'48%', float:'right'}}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    Submit
                </Button>
                <Snackbar
                    open={snackBarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackBarClose}
                    message="Employee Added! Default password: 0000"
                    action={
                        <Button color="inherit" onClick={handleSnackBarClose}>
                            OK
                        </Button>
                    }
                />
            </Box>
    );
}

export default AddEmployee;