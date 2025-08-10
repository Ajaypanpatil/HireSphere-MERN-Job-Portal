import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, <strong>{user?.name}</strong> — role: {user?.role}</p>

      <button
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="bg-red-600 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
