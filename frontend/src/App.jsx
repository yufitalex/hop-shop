import React from "react";
import Header from "./features/Header";
import { Container } from "react-bootstrap";
import Footer from "./features/Footer";
import { Outlet } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer closeOnClick/>
    </>
  );
};

export default App;
