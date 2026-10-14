import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import {
  Code2, Zap, CheckCircle2, ShieldCheck,
  Terminal, Sparkles, ChevronRight
} from 'lucide-react';

import { Button, Input, Label, Card } from '../components/UIcomponents'
import AvatarImage from '../assets/defaultAvatar.jpg'
import axios from '../config/AxiosInstance';

const Navbar = ({isLogin, setIsLogin}) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await axios.post("/user/logout").then(response => { }).catch(error => console.warn(error));
    setIsLogin(false)
    navigate("/", { replace: true })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span>SleekReview</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </div>
        <div className="flex gap-4">{
          !isLogin && <>
            <Button variant="ghost" className="hidden sm:inline-flex">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button>
              <Link to="/register">Get Started</Link>
            </Button>
          </>
        }
          {isLogin && (
            <div className="hidden md:flex md:ml-6 items-center">
              <div className="relative group">
                <img src={AvatarImage} alt="User Avatar" className="w-8 h-8 rounded-full object-cover cursor-pointer" />

                <div className="absolute right-0 mt-3 w-32 bg-white text-black rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-1 group-hover:translate-y-0 transition-all">
                  <p className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/profile')}>Profile</p>
                  <p className="px-3 py-2 text-red-600 hover:bg-gray-100 cursor-pointer" onClick={handleLogOut}>Logout</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar
