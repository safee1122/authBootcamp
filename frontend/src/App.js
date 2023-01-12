import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";

import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import tokenExpired from "./Services/jwtRefresh";
import { userLogout, userRefreshToken } from "./slices/userLoginSlice";
import ProfileScreen from "./screens/profileScreen";
function App() {
  const { userInfo } = useSelector((state) => state.user);
  useEffect(()=>{
    console.log(userInfo)
  },[userInfo])
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route
              path="/login"
              element={
                <ProtectedRoute redirectPath="/profile" userInfo={userInfo}>
                  <LoginScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute redirectPath="/profile" userInfo={userInfo}>
                  <RegisterScreen />
                </ProtectedRoute>
              }
            />
             <Route
              path="/profile"
              element={
                <ProtectedRoute redirectPath="/login" userInfo={!userInfo}>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;
