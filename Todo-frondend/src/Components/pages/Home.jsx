import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../otherComponents/NavBar";
import {
  createProject,
  deleteProject,
  getUserProjects,
} from "../../Utility/project";
import Alert from "../otherComponents/Alert";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [projects, setProjects] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectId, setProjectId] = useState();
  const auth = useSelector((state) => state.auth);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user?.id && auth?.token) {
      fetchProjects();
    }
  }, [auth]);

  const fetchProjects = async () => {
    try {
      const data = await getUserProjects(auth.user.id, auth.token);
      console.log(data);
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const handleCreateProject = async () => {
    if (!projectTitle.trim()) return;
    try {
      await createProject(projectTitle, auth.user.id, auth.token);
      fetchProjects();
      setIsModalOpen(false);
      setProjectTitle("");
      setAlert({ message: "Project created successfully!", status: "success" });
      setShowAlert(true);
    } catch (error) {
  const errorMessage =
    error.response?.data?.message || "Failed to create project";

  setAlert({ message: errorMessage, status: "error" });
  setShowAlert(true);
  console.error("Failed to create project:", errorMessage);
}
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId, auth.token);
      setShowDeleteModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <NavBar />
      {showAlert && (
          <Alert  
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      <div className="w-3/4 mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Projects</h1>
        <div className="flex space-x-4 mb-4 justify-around">
          <div className="w-2/3">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-2 border rounded w-1/3"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-2 border rounded w-1/3"
            />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded flex-1"
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Project
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
              <input
                type="text"
                placeholder="Project Title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={handleCreateProject}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          {projects
            .filter((project) => {
              const projectDate = new Date(project.createdAt);
              const from = fromDate ? new Date(fromDate) : null;
              const to = toDate ? new Date(toDate) : null;
          
              const isWithinDateRange =
                (!from || projectDate >= from) && (!to || projectDate <= new Date(to.setHours(23, 59, 59, 999)));
          
              const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
          
              return isWithinDateRange && matchesSearch;
            })
            .map((project, indx) => (
              <div
                key={indx}
                className="p-2 border-b cursor-pointer hover:bg-gray-200 transition flex items-center justify-between"
              >
                <div
                  key={project.id}
                  className="flex items-center"
                  onClick={() => navigate(`/view/${project.id}`)}
                >
                  <p className="text-xl">{project.title}</p>
                  <p className="text-xs pl-5 text-gray-500">
                    {new Date(project.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setProjectId(project.id);
                  }}
                  className="text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Are you sure?</h2>
            <p>This will delete the project and all todos inside it.</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white ml-2"
                onClick={handleDeleteProject}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
