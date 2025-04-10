import Login from "./components/authComponent/Login";
import Profile from "./components/authComponent/Profile";
import SignUp from "./components/authComponent/SignUp";
import Tables from "./components/Tables";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/authComponent/ProtectedRoute";
import ForgetPassword from "./components/authComponent/ForgetPassword";
import ResetPassword from "./components/authComponent/ResetPassword";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Tables />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
