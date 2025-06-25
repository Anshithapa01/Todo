import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../Store/authSlice";
import ProfilePage from "../pages/Profile";
import ViewProject from "../pages/ViewProject";
import ExportedGists from "../pages/ExportedGists";

const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

    return (
      <div className="flex min-h-screen">   
          <Routes> 
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/view/:projectId" element={<ViewProject />} />
            <Route path="/exported-gists" element={<ExportedGists />} />
          </Routes>
        </div>
    );
  };
export default AppRoutes
