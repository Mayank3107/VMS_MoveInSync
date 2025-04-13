import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router'
import Main from './Components/Main'
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import AdminHome from './Components/Admin/Home';
import AdminAdd from './Components/Admin/Add';
import AdminEdit from './Components/Admin/Edit';
import AdminVisitor from './Components/Admin/Visitors';
import EditUser from './Components/Admin/EditUser';
import VisitorHome from './Components/Visitor/Home';
import VisitorRequest from './Components/Visitor/Request';
import Guard from './Components/Guard/Home';
import EmployeeVisit from './Components/Employee/Create'
import EmployeeRequest from './Components/Employee/Request'
import Error from './Components/Error'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="*" element={<Error/>}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />

        {/* Admin Routes */}
        <Route path="/Admin/Home" element={<AdminHome />} />
        <Route path="/Admin/Add" element={<AdminAdd />} />
        <Route path="/Admin/Edit" element={<AdminEdit />} />
        <Route path="/Admin/Visitors" element={<AdminVisitor />} />
        <Route path="/admin/edit/:id" element={<EditUser />} />

        {/* You can add Employee and Visitor dashboards as you go */}
        <Route path="/Visitor/Home" element={<VisitorHome />} />
        <Route path="/visitor/request" element={<VisitorRequest />} />

        <Route path="/Guard/Home" element={<Guard/>}/>

        <Route path="/employee/create" element={<EmployeeVisit/>}/>
        <Route path="/employee/request" element={<EmployeeRequest/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
