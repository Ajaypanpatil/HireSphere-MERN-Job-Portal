// CandidateLayout.jsx
import { Link, Outlet } from "react-router-dom";

export default function CandidateLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Candidate Panel</h2>
        <nav className="space-y-2">
          <Link to="/candidate" className="block hover:bg-gray-700 p-2 rounded">
            Dashboard
          </Link>
          <Link
            to="/candidate/applications"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            My Applications
          </Link>
          <Link
            to="/candidate/profile"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            My Profile
          </Link>
          <Link
            to="/candidate/interview"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Interview
          </Link>
          <Link
            to="/candidate/my-interviews"
            className="block hover:bg-gray-700 p-2 rounded"
          >
            Interview History
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
