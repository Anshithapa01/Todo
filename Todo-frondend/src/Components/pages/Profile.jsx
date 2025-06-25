import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../otherComponents/Alert";
import { fetchUserProfile } from "../../Store/authSlice";
import { editProfile } from "../../Utility/Auth";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const [username, setUsername] = useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (store.user) {
      setUsername(store.user.username);
    }
  }, [store.user]);

  const handleSave = async () => {
    try {
      await editProfile(
        { username: username }, // Match the backend field name
        store.token
      );
  
      setAlert({ message: "Profile updated successfully!", status: "success" });
      setShowAlert(true);
    } catch (error) {
      setAlert({ message: "Profile update failed!", status: "error" });
      setShowAlert(true);
    }
  };
  

  return (
    <div className="flex items-center justify-center pt-32 w-full">
      {showAlert && (
          <Alert  
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      <div className="max-w-lg bg-white p-6 rounded shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Email</label>
          <input
            type="text"
            value={store.user?.email || ""}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
