import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const UserPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Sending a GET request with Authorization header containing JWT token
          const response = await axios.get("http://localhost:5000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // Update user data
        } catch (error) {
          console.log(
            "Error fetching user data:",
            error.response?.data || error
          );
        }
      } else {
        console.log("No token found");
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>; // Optionally show a loading message if data is not yet loaded
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <h1>Welcome, {user?.email}</h1>
      <h1>Welcome, {user?.image}</h1>
      {/* <img src={`.public/userImages/${user?.image}`} alt="img" width={500} /> */}
    </div>
  );
};

export default UserPage;
