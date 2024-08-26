import { Container, Grid, Skeleton, Typography } from "@mui/material"
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import jwt from "jwt-decode";

const columns = [
    { field: 'emp_id', headerName: 'ID', width: 120 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'Email', headerName: 'Email', width: 230 },
    { field: 'job-title', headerName: 'Job Title', width: 200 },
    { field: 'department', headerName: 'Department', width: 150 }
  ];


const Supervisees = () => {

  const [rows, setRows] = useState([]);
  const [cookies] = useCookies(['x-ual', 'x-uData']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Supervisees | HRM-Portal';
    setIsLoading(true);

    const uData = jwt(cookies['x-uData']);

    axios.post('http://localhost:3000/api/users/supervisees',{EmployeeID:uData.EmployeeID})
    .then(res => {
      console.log(res.data.supervisees);
      
      let data = [];
      for (let i = 0; i < res.data.supervisees.length; i++) {
        data.push({
          id: i+1,
          emp_id: res.data.supervisees[i].EmployeeID,
          name: res.data.supervisees[i].EmployeeName,
          Email: res.data.supervisees[i].Email,
          gender: res.data.supervisees[i].Gender,
          'job-title': res.data.supervisees[i].JobTitleName,
          department: res.data.supervisees[i].DepartmentName,
          UserAccountLevelID: res.data.supervisees[i].UserAccountLevelID,
          UserAccountLevelName: res.data.supervisees[i].UserAccountLevelName,
          UserID: res.data.supervisees[i].UserID
        });
      }
      // console.log(data);
      setRows(data);

    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      setIsLoading(false);
    });

  },[]);

  const navigate = useNavigate();

  const handleRowClick = (row) => {
    // sending id as state to the next page
    navigate('/dashboard/supervisees/edit-employee', {state: {EmployeeID: row.row.emp_id, UserID: row.row.UserID}});
  }

  return ( 
      <Container>
          {isLoading && (
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
            </>
          )}
          {!isLoading && (
            <>
              <br />
              <Typography variant="h6">
                  Supervisees
              </Typography>
              <br />
              <div style={{ height: '80%', width: '100%' }}>
                { rows.length > 0 ? (
                  <DataGrid
                      rows={rows}
                      columns={columns}
                      initialState={{
                      pagination: {
                          paginationModel: { page: 0, pageSize: 10 },
                      },
                      }}
                      pageSizeOptions={[10, 15]}
                      onRowClick={(row) => handleRowClick(row)}
                      
                  />
                ):(
                  <Typography variant="body">
                    You don't have any supervisees!
                  </Typography>
                )}
              </div>
            </>
          )}
      </Container>
    );
}
 
export default Supervisees;