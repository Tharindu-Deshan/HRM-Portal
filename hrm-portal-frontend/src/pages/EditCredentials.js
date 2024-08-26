import { Box, Container, Typography } from "@mui/material";
import UserCredentialsForm from "../components/userCredentialsForm";

const EditCredentials = () => {
    return ( 
        <Box sx={{maxWidth:'840px', margin:'auto'}}>
            <Typography variant="h5" sx={{textAlign:'center', my:2}}><b>Edit Credentials</b></Typography>
            <UserCredentialsForm />
        </Box>
     );
}
 
export default EditCredentials;