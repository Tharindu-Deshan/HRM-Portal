import { Container, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";


const EmergencyInfo = ({data, isReadOnly, getData, errorInForm}) => {
    const [name1, setName1] = useState('');
    const [telNo1, setTelNo1] = useState('');
    const [name2, setName2] = useState('');
    const [telNo2, setTelNo2] = useState('');
    const [emergencyAddress, setEmergencyAddress] = useState('');

    const [name1Error, setName1Error] = useState(false);
    const [telNo1Error, setTelNo1Error] = useState(false);
    const [name2Error, setName2Error] = useState(false);
    const [telNo2Error, setTelNo2Error] = useState(false);
    const [emergencyAddressError, setEmergencyAddressError] = useState(false);

    const setErrorState = (value, setErrorFunction) => {
        setErrorFunction(value === '' || value === null || value === undefined);
    };

    useEffect(() => {

        if (errorInForm) {
            setErrorState(name1, setName1Error);
            setErrorState(telNo1, setTelNo1Error);
            setErrorState(name2, setName2Error);
            setErrorState(telNo2, setTelNo2Error);
            setErrorState(emergencyAddress, setEmergencyAddressError);
          }

        if(isReadOnly){
            setName1(data && data.emergencyInfo.name1 || '');
            setTelNo1(data && data.emergencyInfo.telNo1 || '');
            setName2(data && data.emergencyInfo.name2 || '');
            setTelNo2(data && data.emergencyInfo.telNo2 || '');
            setEmergencyAddress(data && data.emergencyInfo.emergencyAddress || '');
        }else{
            let formData = {name1, telNo1, name2, telNo2, emergencyAddress};
            if(isFormDataValid()){
                getData(formData);
            }else{
                getData(null);
            }
        }
    } , [isReadOnly, data, name1, telNo1, name2, telNo2, emergencyAddress, errorInForm]);

    const isFormDataValid = () => {
        return (
            name1 !== '' &&
            telNo1 !== '' &&
            name2 !== '' &&
            telNo2 !== '' &&
            emergencyAddress !== ''
        );
    };    

    return (
        <Container sx={{marginY:2, border:1, borderColor:'grey.400', borderRadius:2, padding:4}}>
            <Typography variant="h6" marginBottom={2}>Emergency Information</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    id="name1"
                    label="Name"
                    variant="standard"
                    fullWidth
                    required
                    {...(name1Error && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={name1}
                    {...(isReadOnly ? {} : {onChange: (e) => setName1(e.target.value)})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="tel-no1"
                    label="Tel No"
                    variant="standard"
                    fullWidth
                    required
                    {...(name1Error && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={telNo1}
                    {...(isReadOnly ? {} : {onChange: (e) => setTelNo1(e.target.value)})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="name2"
                    label="Name"
                    variant="standard"
                    fullWidth
                    required
                    {...(name1Error && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={name2}
                    {...(isReadOnly ? {} : {onChange: (e) => setName2(e.target.value)})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="tel-no2"
                    label="Tel No"
                    variant="standard"
                    fullWidth
                    required
                    {...(name1Error && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={telNo2}
                    {...(isReadOnly ? {} : {onChange: (e) => setTelNo2(e.target.value)})}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="emergency-address"
                    label="Address"
                    variant="standard"
                    fullWidth
                    required
                    {...(name1Error && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={emergencyAddress}
                    {...(isReadOnly ? {} : {onChange: (e) => setEmergencyAddress(e.target.value)})}
                />
            </Grid>
        </Grid>
        </Container>
    );
}
export default EmergencyInfo;