import { Container, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


const PersonalInfo = ({data, isReadOnly, getData, errorInForm}) => {
    
    const userAccountTypes = [
        {
            value: 'Level1',
            label: 'Employee'
        },
        {
            value: 'Level2',
            label: 'Supervisor'
        },
        {
            value: 'Level3',
            label: 'HR-Manager'
        }
    ];

    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('Sri Lanka');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userAccountType, setUserAccountType] = useState('Level1');
    const [dob, setDob] = useState('2001/11/03');
    const [maritalStatus, setMaritalStatus] = useState('Married');
    const [gender, setGender] = useState('Male');
    const [dependentName, setDependentName] = useState('');
    const [dependentAge, setDependentAge] = useState('');

    const [errorInThisForm, setErrorInThisForm] = useState(false);

    const [nameError, setNameError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [countryError, setCountryError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [userAccountTypeError, setUserAccountTypeError] = useState(false);
    const [dobError, setDobError] = useState(false);
    const [maritalStatusError, setMaritalStatusError] = useState(false);
    const [genderError, setGenderError] = useState(false);


    const setErrorState = (value, setErrorFunction) => {
        setErrorFunction(value === null || value === '' || value === undefined);
    };

    useEffect(() => {
        
        if (errorInForm) {
            setErrorState(name, setNameError);
            setErrorState(address, setAddressError);
            setErrorState(country, setCountryError);
            setErrorState(username, setUsernameError);
            setErrorState(email, setEmailError);
            setErrorState(userAccountType, setUserAccountTypeError);
            setErrorState(dob, setDobError);
            setErrorState(maritalStatus, setMaritalStatusError);
            setErrorState(gender, setGenderError);
          }

        if(isReadOnly){
            setName(data && data.personalInfo.name || '');
            setEmployeeId(data && data.personalInfo.employeeID || '');
            setAddress(data && data.personalInfo.address || '');
            setCountry(data && data.personalInfo.country || '');
            setUsername(data && data.personalInfo.username || '');
            setEmail(data && data.personalInfo.email || '');
            setUserAccountType(data && data.personalInfo.userAccountType || '');
            setDob(data && data.personalInfo.dob || dayjs());
            setMaritalStatus(data && data.personalInfo.maritalStatus || '');
            setGender(data && data.personalInfo.gender || '');
            setDependentName(data && data.personalInfo.dependentName || '');
            setDependentAge(data && data.personalInfo.dependentAge || '');
        }
        else{
            let formData = {name, address, country, username, email, userAccountType, dob, maritalStatus, gender, dependentName, dependentAge};
            if(isFormDataValid()){
                getData(formData);
            }else{
                getData(null);
            }
        }
    } , [isReadOnly, data, name, address, country, username, email, userAccountType, dob, maritalStatus, gender, dependentName, dependentAge, errorInForm]);
    
    
    const isFormDataValid = () => {
        return (
            (name !== '' )&&
            address !== '' &&
            country !== '' &&
            username !== '' &&
            email !== '' &&
            userAccountType !== '' &&
            dob !== '' &&
            maritalStatus !== '' &&
            gender !== '' &&
            dependentName !== '' &&
            dependentAge !== ''
        );
    };
    
    return (

        <Container sx={{
            marginY:2, border:1, borderColor:'grey.400', borderRadius:2, padding:4
        }}>
            <Typography variant="h6" marginBottom={2}>Personal Information</Typography>
        <Grid container spacing={2}>
            {isReadOnly ? (
                <>
                    <Grid item xs={8}>
                        <TextField
                            id="name"
                            label="Name"
                            variant="standard"
                            fullWidth
                            required
                            {...(nameError && {error:true, helperText:"Please fill in name"})}
                            InputProps={{
                                readOnly: isReadOnly,
                            }}
                            value={name}
                            {...(isReadOnly ? {} : {onChange: (e) => {
                                setName(e.target.value);
                            }})}
                        />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                        id="employee-id"
                        label="Employee ID"
                        variant="standard"
                        fullWidth
                        required
                        disabled
                        value={employeeId}
                    />
                </Grid>
                </>
            ):(
                <Grid item xs={12}>
                    <TextField
                        id="name"
                        label="Name"
                        variant="standard"
                        fullWidth
                        required
                        {...(nameError && {error:true, helperText:"Please fill in name"})}
                        InputProps={{
                            readOnly: isReadOnly,
                        }}
                        value={name}
                        {...(isReadOnly ? {} : {onChange: (e) => {
                            setName(e.target.value);
                        }})}
                    />
                </Grid>
            )}
            <Grid item xs={8}>
                <TextField 
                    id="address"
                    label="Address"
                    variant="standard"
                    fullWidth
                    required
                    {...(addressError && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={address}
                    {...(isReadOnly ? {} : {onChange: (e) => setAddress(e.target.value)})}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField 
                    id="country"
                    label="Country"
                    variant="standard"
                    fullWidth
                    required
                    {...(countryError && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={country}
                    {...(isReadOnly ? {} : {onChange: (e) => setCountry(e.target.value)})}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField 
                    id="username"
                    label="username"
                    variant="standard"
                    fullWidth
                    required
                    {...(usernameError && {error:true, helperText:"Please fill in this field"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={username}
                    {...(isReadOnly ? {} : {onChange: (e) => setUsername(e.target.value)})}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField 
                    id="email"
                    label="Email"
                    variant="standard"
                    fullWidth
                    required
                    {...(emailError && {error:true, helperText:"Please use a valid Email"})}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={email}
                    {...(isReadOnly ? {} : {onChange: (e) => setEmail(e.target.value)})}
                />
            </Grid>
            <Grid item xs={4}>
                <TextField 
                    id="userAccountType"
                    label="User Account Type"
                    variant="standard"
                    fullWidth
                    required
                    {...(userAccountTypeError && {error:true, helperText:"Please fill in this field"})}
                    select
                    value={userAccountType}
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    {...(isReadOnly ? {} : {onChange: (e) => setUserAccountType(e.target.value)})}
                >
                    {userAccountTypes.map((option) => (
                            <option key={option.value} value={option.value}>
                            {option.label}
                            </option>
                        ))}
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date of Birth"
                        // {...(dobError && {error:true, helperText:"Please fill in this field"})}
                        value={ dob != '' ? dayjs(dob) : dayjs()}
                        {...(isReadOnly ? {} : {onChange: (newValue) => setDob(dayjs(newValue).format("YYYY/MM/DD"))})}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
                <TextField 
                    id="marital-status"
                    label="Marital Status"
                    variant="standard"
                    fullWidth
                    required
                    {...(maritalStatusError && {error:true, helperText:"Please fill in this field"})}
                    select
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}    
                    value={maritalStatus}
                    {...(isReadOnly ? {} : {onChange: (e) => setMaritalStatus(e.target.value)})}
                >
                    <option value={'Married'}>Married</option>
                    <option value={'Unmarried'}>Not Married</option>
                </TextField>
            </Grid>
            <Grid item xs={4}>
                <TextField 
                    id="gender"
                    label="Gender"
                    variant="standard"
                    fullWidth
                    required
                    {...(genderError && {error:true, helperText:"Please fill in this field"})}
                    select
                    SelectProps={{
                        native: true,
                    }}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={gender}
                    {...(isReadOnly ? {} : {onChange: (e) => setGender(e.target.value)})}
                >
                    <option value={'Male'}>Male</option>
                    <option value={'Female'}>Female</option>
                </TextField>
            </Grid>
            <br /><br />
            <Grid item xs={6}>
                <TextField
                    id="dependent-name"
                    label="Dependent Name"
                    variant="standard"
                    fullWidth
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={dependentName}
                    {...(isReadOnly ? {} : {onChange: (e) => {
                        setDependentName(e.target.value);
                    }})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="dependent-age"
                    label="Dependent Age"
                    variant="standard"
                    fullWidth
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={dependentAge}
                    {...(isReadOnly ? {} : {onChange: (e) => {
                        setDependentAge(e.target.value);
                    }})}
                />
            </Grid>
        </Grid>
        </Container>
    );
}

export default PersonalInfo;