import { useEffect, useState } from "react";
import { getAllGists } from "../../Utility/Gist";
import { useSelector } from "react-redux";

const ExportedGists = () => {
  const [gists, setGists] = useState([]);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    fetchGists();
  }, []);

  const fetchGists = async () => {
    const data = await getAllGists(auth.token);
    console.log(data);
    
    setGists(data);
  };

  return (
    <div className="min-h-screen w-full p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Exported Gists</h2>
        {gists.length === 0 ? (
          <p>No exported gists found.</p>
        ) : (
          <ul className="space-y-2">
            {gists.map((gist) => (
              <li key={gist.id} className="border-b pb-2">
                <a
                  href={gist.gistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color:'#c208b9'}}
                >
                  {gist.projectTitle}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExportedGists;
