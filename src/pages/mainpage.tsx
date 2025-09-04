import React from 'react'
import HeaderLog from '../components/headerlogin'
import WelcomePage from '../components/welcome'
import { Routes, Route } from 'react-router-dom';



const Mainpage = () => {
  return (<>
   <HeaderLog/>
   
  <WelcomePage/>
 
 </>

  )
}

export default Mainpage