import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RecruiterLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          HireSphere
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/recruiter"
            className="block px-4 py-2 rounded hover:bg-blue-700"
          >
            📊 Dashboard
          </Link>
          <Link
            to="/recruiter/post-job"
            className="block px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Post Job
          </Link>
          <Link
            to="/recruiter/my-jobs"
            className="block px-4 py-2 rounded hover:bg-blue-700"
          >
            📂 My Jobs
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">
            Welcome, {user?.name || "Recruiter"}
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </header>

        {/* Render child routes */}
        <Outlet />
      </main>
    </div>
  );
}
