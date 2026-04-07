import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Home from '../screens/Home'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Dashboard from '../screens/Dashboard'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </Router>
    )
}

{/* <Navigate to="/login" replace /> */ }

export default AppRoutes
