import { useEffect, useState } from "react";
import api from "../api";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/users")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Usuarios</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
