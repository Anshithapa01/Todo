import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "../../Utility/project";
import { deleteTodo, updateTodo, addTodo } from "../../Utility/todo";
import { exportToGist } from "../../Utility/Gist";

const ViewProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [project, setProject] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [toDate, setToDate] = useState("");
  const [exportedGist, setExportedGist] = useState(null);

  const handleExportToGist = async () => {
    try {
      const data = await exportToGist(project.id, auth.token);
      setExportedGist(data);
      alert("Gist Exported Successfully! URL: " + data.gistUrl);
    } catch (error) {
      alert("Failed to export project to GitHub Gist.");
    }
  };
  useEffect(() => {
    if (auth?.user?.id && auth?.token) {
      fetchProjectDetails();
    }
  }, [auth]);

  const fetchProjectDetails = async () => {
    try {
      const data = await getProjectById(projectId, auth.token);
      setProject(data);
      setTitle(data.title);
    } catch (error) {
      console.error("Failed to fetch project details", error);
    }
  };

  const handleTitleUpdate = async () => {
    try {
      await updateProject(projectId, title, auth.token);
      setEditingTitle(false);
    } catch (error) {
      console.error("Failed to update title", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId, auth.token);
      navigate("/home");
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  if (!project) return <div>Loading...</div>;

  const handleAddOrUpdateTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, { description: newTodo }, auth.token);
      } else {
        await addTodo(
          projectId,
          { description: newTodo, completed: false, updatedAt: new Date() },
          auth.token
        );
      }
      setNewTodo("");
      setEditingTodo(null);
      fetchProjectDetails();
    } catch (error) {
      console.error("Failed to add/update todo", error);
    }
  };

  const handleEditTodo = (todo) => {
    setNewTodo(todo.description);
    setEditingTodo(todo);
  };

  const handleToggleComplete = async (todo) => {
    try {
      const newStatus = todo.status === "COMPLETED" ? false : true;
      await updateTodo(todo.id, { completed: newStatus }, auth.token);
      fetchProjectDetails();
    } catch (error) {
      console.error("Failed to update todo", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId, auth.token);
      fetchProjectDetails();
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  };

  if (!project) return <div>Loading...</div>;

  const pendingTodos = project.todos.filter(
    (todo) => todo.status === "PENDING"
  );
  const completedTodos = project.todos.filter(
    (todo) => todo.status === "COMPLETED"
  );

  const filteredTodos = project.todos.filter((todo) => {
    // Status filter
    const statusMatch = filterStatus === "ALL" || todo.status === filterStatus;
  
    // Date filter
    const todoDate = new Date(todo.updatedAt);
    const fromDateMatch = fromDate ? todoDate >= new Date(fromDate) : true;
    const toDateMatch = toDate ? todoDate <= new Date(toDate) : true;
  
    // Search filter
    const searchMatch = todo.description.toLowerCase().includes(searchTerm.toLowerCase());
  
    // Apply all filters together
    return statusMatch && fromDateMatch && toDateMatch && searchMatch;
  });
  
  
  return (
    <div className="min-h-screen w-full p-6 bg-gray-100">
      <div className="max-w-3/4 mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          {editingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleUpdate}
              className="text-xl font-bold border-b-2 w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => setEditingTitle(true)}>
              {title}
            </h1>
          )}
          <button className="text-red-500" onClick={() => setShowDeleteModal(true)}>🗑️</button>
        </div>
  
        {/* Filters */}
        <div className="flex space-x-4 pb-4 justify-around pt-3">
          <div className="w-2/3">
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="p-2 border rounded w-1/3" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="p-2 border rounded w-1/3" />
          </div>
          <select className="border p-2 rounded-md" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 border rounded flex-1" />
        </div>
  
        {/* Add Todo */}
        <div className="mt-4 flex">
          <input type="text" placeholder="New Todo" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} className="flex-1 p-2 border rounded" />
          <button onClick={handleAddOrUpdateTodo} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">{editingTodo ? "Update" : "Add"}</button>
        </div>
  
        {/* Filtered Todos List */}
        <div className="mt-4">
          {filterStatus === "ALL" && (
            <>
              {pendingTodos.length > 0 && <h3 className="text-2xl pt-5 font-semibold">Pending</h3>}
              <ul>
                {pendingTodos.map((todo) => (
                  <li key={todo.id} className="flex justify-between p-2 border-b items-center">
                    <div className="flex items-center gap-2 text-lg">
                      <input type="checkbox" checked={todo.status === "COMPLETED"} onChange={() => handleToggleComplete(todo)} className="cursor-pointer" />
                      <span onClick={() => handleEditTodo(todo)} className="cursor-pointer">{todo.description}</span>
                      <span className="text-xs text-gray-500 pl-2">{new Date(todo.updatedAt).toLocaleString()}</span>
                    </div>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500">✖</button>
                  </li>
                ))}
              </ul>
  
              {completedTodos.length > 0 && <h3 className="text-lg font-semibold pt-5">Completed</h3>}
              <ul>
                {completedTodos.map((todo) => (
                  <li key={todo.id} className="flex justify-between p-2 border-b items-center">
                    <div className="flex items-center gap-2 text-lg">
                      <input type="checkbox" checked={todo.status === "COMPLETED"} onChange={() => handleToggleComplete(todo)} className="cursor-pointer" />
                      <span className="line-through text-gray-500">{todo.description}</span>
                      <span className="text-xs text-gray-500 pl-2">{new Date(todo.updatedAt).toLocaleString()}</span>
                    </div>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500">✖</button>
                  </li>
                ))}
              </ul>
            </>
          )}
  
          {/* Show Filtered Todos when not 'ALL' */}
          {filterStatus !== "ALL" && (
            <>
              {filteredTodos.length > 0 && <h3 className="text-2xl pt-5 font-semibold">{filterStatus === "PENDING" ? "Pending" : "Completed"}</h3>}
              <ul>
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className="flex justify-between p-2 border-b items-center">
                    <div className="flex items-center gap-2 text-lg">
                      <input type="checkbox" checked={todo.status === "COMPLETED"} onChange={() => handleToggleComplete(todo)} className="cursor-pointer" />
                      <span className={todo.status === "COMPLETED" ? "line-through text-gray-500" : ""}>{todo.description}</span>
                      <span className="text-xs text-gray-500 pl-2">{new Date(todo.updatedAt).toLocaleString()}</span>
                    </div>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500">✖</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
  
        <button onClick={handleExportToGist} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Export to GitHub Gist</button>
        {exportedGist && (
          <div className="mt-4">
            <p>Gist Exported: <a href={exportedGist.gistUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">{exportedGist.gistUrl}</a></p>
          </div>
        )}
      </div>
  
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Are you sure?</h2>
            <p>This will delete the project and all todos inside it.</p>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-300" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white ml-2" onClick={handleDeleteProject}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ViewProject;
