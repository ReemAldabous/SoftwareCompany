import './App.css'
import Home from './pages/home'

import Mainpage from './pages/mainpage';
import Project from './pages/projects';
import EmployeeManagement from './pages/employees';
import InactiveAccounts from './pages/activing';
import ProjectDetails from './pages/ProjectDetails';
import DevelopersManager from './pages/developers';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DeveloperDetails from './pages/DeveloperDetails';

function App() {

  return (
    <>
    
     
  
     
     
     <Routes>
     <Route path="/" element={< Home/>} /> 
     <Route path="/home" element={< Mainpage/>} /> 
      <Route path="/projects" element={< Project/>} /> 
      <Route path="/employees" element={< EmployeeManagement/>} /> 
      <Route path="/developers" element={<DevelopersManager/>} /> 
      <Route path="/Activitine" element={<InactiveAccounts/>} /> 
      <Route path="/projects/:id" element={<ProjectDetails/>} /> 
      <Route path="/developers/:id" element={<DeveloperDetails/>} /> 

      
     
    
     </Routes>
     
    </>
  )
}

export default App
