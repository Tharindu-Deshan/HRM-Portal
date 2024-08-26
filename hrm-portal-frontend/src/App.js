import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import { createTheme ,ThemeProvider } from '@mui/material/styles';
import Dashboard from './pages/Dashboard';
import MyAccount from './pages/MyAccount';
import Page404 from './pages/Page404';
import RequestALeave from './pages/RequestALeave';
import ManageLeave from './pages/ManageLeave';
import AddEmployee from './pages/AddEmployee';
import LeaveApproval from './pages/LeaveApproval';
import Home from './pages/Home';
import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import Supervisees from './pages/Supervisees';
import EditEmployee from './pages/EditEmployee';
import Reports from './pages/Reports';
import EditCredentials from './pages/EditCredentials';

const theme = createTheme({
  typography:{
    fontFamily: 'Poppins'
  }
})
function App() {

  const [cookies] = useCookies(['userLoggedIn']);
  const [userlevelID, setUserlevelID] = useState(0);

  // ------
  const [isLogged, setIsLogged] = useState(false);
  const handleLogin = (e) => {
    setIsLogged(e);
  }

  useEffect(()=>{
    setUserlevelID(cookies['x-ual']);
  }, [], cookies);
  // ---- remove theses

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path='/' element={
            cookies.userLoggedIn ? <Navigate to="/dashboard/home" /> : <Navigate to="/login" />
          }/>
          <Route exact path='/login' element={
            cookies.userLoggedIn ? <Navigate to="/dashboard/home" /> : <Login setLoggedIn={handleLogin}/>
          }/>
          {cookies.userLoggedIn && (
            <Route exact path='/dashboard' element={<Dashboard/>}>
              <Route path='/dashboard/home' element={<Home/>}/>
              <Route path='/dashboard/myAccount' element={<MyAccount/>}/>
              <Route path='/dashboard/manage-leaves' element={cookies['x-ual'] <= 3 ? <ManageLeave/> : <Navigate to="/404" />}/>
              <Route path='/dashboard/manage-leaves/leave-approval' element={cookies['x-ual'] <= 3 ? <LeaveApproval/> : <Navigate to="/404" />}/>
              <Route path='/dashboard/supervisees' element={<Supervisees/>}/>
              <Route path='/dashboard/supervisees/edit-employee' element={<EditEmployee/>}/>
              <Route path='/dashboard/request-a-leave' element={<RequestALeave/>}/>
              <Route path='/dashboard/add-employee' element={<AddEmployee/>}/>
              <Route path='/dashboard/edit-credentials' element={<EditCredentials/>}/>
              <Route path='/dashboard/reports' element={cookies['x-ual'] <= 2 ? <Reports/> : <Navigate to="/404" />}/>
          </Route>
          )}
          <Route path='/*' element={<Page404 />}/>
          <Route path='/404' element={<Page404/>}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
