import React from 'react'
import {RouterProvider} from "react-router-dom";
import {routes} from "./app.routes.jsx";
import './App.css';
import "remixicon/fonts/remixicon.css";
import { useSelector } from 'react-redux';
import { useAuth } from '../features/auth/hook/useAuth';
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
const App = () => {

  const{handleGetMe} = useAuth();

      const user = useSelector(state => state.auth.user);
  //  console.log(user);
   

   useEffect(() => {
    handleGetMe();
   }, [])

  return (
  <>
  
 
 <Toaster
  position="top-right"
  reverseOrder={false}
  gutter={12}
  containerStyle={{
    top: 90,
    right: 20,
  }}
  toastOptions={{
    duration: 3000,

    style: {
      background: "#1b1c1a",
      color: "#fbf9f6",
      border: "1px solid #C9A96E",
      padding: "16px",
      fontSize: "14px",
      borderRadius: "12px",
    },

    success: {
      iconTheme: {
        primary: "#C9A96E",
        secondary: "#ffffff",
      },
    },

    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#ffffff",
      },
    },
  }}
/>

    <RouterProvider router={routes} />

    </>
  )
}

export default App
