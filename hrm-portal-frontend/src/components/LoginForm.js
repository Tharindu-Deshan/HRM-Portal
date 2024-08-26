import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'
import { useCookies } from 'react-cookie';

const sign = require('jwt-encode');
const secret = 'secret-hrm';


const LoginForm = ({setLoggedIn, snackBarOpen}) => {

    const [cookie, setCookie] = useCookies(['userLoggedIn', 'u-token', 'x-ual', 'x-uData']);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errUserName, setErrUserName] = useState(false);
    const [errorCredentials, setErrorCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onValidUsername = (val) => {
        const usernameRegex = /^[A-Za-z0-9_.@]+$/
        return usernameRegex.test(val)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(onValidUsername(email)){

            // hashing password
            var hash = require('hash.js')
            const passwordHash = hash.sha256().update(password).digest('hex');

            const values={ email , password: passwordHash };
            console.log(values);


            axios.post('http://localhost:3000/api/users/login',values)
            .then(res=>{
                console.log(res.data);
                if(res.data.success==1){
                    const userData = {
                        EmployeeID:res.data.values.EmployeeID,
                        UserID:res.data.values.UserID,
                        TotalLeavesTaken: null
                    };

                    const jwt = sign(userData, secret);

                    setCookie('userLoggedIn', true, { path: '/' , expires: new Date(Date.now() + 3600000)}); // cookie expires in 1 h
                    setCookie('u-token', res.data.token, { path: '/' , expires: new Date(Date.now() + 3600000)}); // cookie expires in 1 h
                    setCookie('x-ual', res.data.values.UserAccountLevelID, { path: '/' , expires: new Date(Date.now() + 3600000)}); // ual - user acount level : cookie expires in 1 h
                    setCookie('x-uData', jwt, { path: '/' , expires: new Date(Date.now() + 3600000)}); // cookie expires in 1 h
                    
                    setLoggedIn(true);
                    navigate('/dashboard/home');
                }
                else if(res.data.success==0){
                    setErrorCredentials(true);
                }
            }).catch(err=>{
                console.log("Axios post Error");
                console.log(err);
                // alert("Invalid username or password");
                setErrorCredentials(true);
            }).finally(()=>{
                setIsLoading(false);
            });
        }
        else{
            setErrUserName(true);
            setIsLoading(false);
        }
    }

    return ( 
        <Box paddingX={6}>
            <Typography variant="h5"><b>Hello Again!</b></Typography>
            <Typography variant="body2">Welcome Back</Typography>
            <form>
                <TextField
                    label="email"
                    variant="outlined"
                    fullWidth
                    {...(errUserName && {error:true, helperText:"Invalid email"})}
                    {...(errorCredentials && {error:true})}
                    sx={{my:1}}
                    onChange={(e)=>{
                        setEmail(e.target.value);
                        setErrUserName(false);
                        setErrorCredentials(false);
                    }}
                />
                <TextField 
                    label="password" 
                    variant="outlined" 
                    type="password" 
                    fullWidth 
                    {...(errorCredentials && {error:true, helperText:"Invalid email or password"})}
                    sx={{my:1}} 
                    onChange={(e)=>{
                        setPassword(e.target.value);
                        setErrorCredentials(false);
                    }}
                    onKeyDown={(e) => {
                        if(e.key == "Enter"){
                            handleSubmit(e);
                        }
                    }}
                />
                <Box display={"flex"}>
                    <Button variant="text" sx={{mt:1, mr:2}} onClick={snackBarOpen}>Forgot Password?</Button>
                    {isLoading ? (
                        <Button variant="contained" disabled sx={{px:10, mt:1, flexGrow:1}}>Loading...</Button>
                    ):(
                        <Button variant="contained" sx={{px:10, mt:1, flexGrow:1}} onClick={handleSubmit}> Login </Button>
                    )}
                </Box>
            </form>
        </Box>
    );
}

export default LoginForm;