import { Container, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";

const CustomAttribute = ({data, isReadOnly, getData}) => {

    const [attributeName, setAttributeName] = useState('');
    const [attributeValue, setAttributeValue] = useState('');

    useEffect(() => {
        if(isReadOnly){
            setAttributeName(data && data.AttributeName || '');
            setAttributeValue(data && data.AttributeValue || '');
        }
        else{
            let formData = {AttributeName: attributeName, AttributeValue: attributeValue};
            getData(formData);
        }
    } , [isReadOnly, data, attributeName, attributeValue]);
    
    return (

        <Container sx={{
            marginY:2, border:1, borderColor:'grey.400', borderRadius:2, padding:4
        }}>
            <Typography variant="h6" marginBottom={2}>Custom Attribute</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    id="attribute-name"
                    label="Attribute Name"
                    variant="standard"
                    fullWidth
                    required
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={attributeName}
                    {...(isReadOnly ? {} : {onChange: (e) => {
                        setAttributeName(e.target.value);
                    }})}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField 
                    id="attribute-value"
                    label="Value"
                    variant="standard"
                    fullWidth
                    required
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    value={attributeValue}
                    {...(isReadOnly ? {} : {onChange: (e) => setAttributeValue(e.target.value)})}
                />
            </Grid>
        </Grid>
        </Container>
    );
}

export default CustomAttribute;