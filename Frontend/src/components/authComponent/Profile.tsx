import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api
      .get(`/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        console.log("Session expired. Please log in again.");
        navigate("/login");
      });
  }, [navigate]);

  let handleLogout = () => {
    axios
      .post(`${apiUrl}/logout`, {}, { withCredentials: true })
      .then(() => {
        console.log("Logout Susccessfull");
        navigate("/login");
      })
      .catch((err) => {
        console.log(`Logout Failed ${err.message}`);
      });
  };

  return (
    <div className="profile">
      <h1>Profile Page</h1>
      {data ? (
        <>
          <h1 style={{ color: "brown" }}>Hello, {data.user?.name}</h1>
          <h1 style={{ color: "blue" }}>Email: {data.user?.email}</h1>
        </>
      ) : (
        <p>Loading profile data...</p>
      )}
      <button id="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
