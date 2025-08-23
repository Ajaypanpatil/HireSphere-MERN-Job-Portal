import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBell, FaSearch } from "react-icons/fa";


const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNotification] = useState(true); // mock notification state
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b shadow sticky top-0 z-50">
      <div className="w-full flex items-center justify-between px-8 py-4">
        {/* Logo (left corner) */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-500 text-white rounded flex items-center justify-center font-bold shadow">
            HS
          </div>
          <span className="font-bold text-2xl text-blue-600">HireSphere</span>
        </Link>

        {/* Center navigation + Search bar */}
        <nav className="flex-1 flex justify-center items-center gap-8 text-lg font-medium">
          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Search jobs, companies..."
              className="w-full border rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <Link to="/jobs" className="hover:text-blue-500">
            Jobs
          </Link>
        </nav>

        {/* Right side: Login/Register OR Notifications + Profile */}
        <div className="flex items-center gap-6 relative">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border rounded-lg hover:bg-blue-500 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Notification */}
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <FaBell className="w-6 h-6 text-gray-600" />
                {hasNotification && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Hi, {user?.username}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border shadow rounded-lg overflow-hidden">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </button>

                    {/* Recruiter menu */}
                    {user.role === "recruiter" && (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => navigate("/recruiter")}
                        >
                          Recruiter Dashboard
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => navigate("/post-job")}
                        >
                          Post Job
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => navigate("/my-jobs")}
                        >
                          View Jobs
                        </button>
                      </>
                    )}

                    {/* Candidate menu */}
                    {user.role === "candidate" && (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => navigate("/candidate")}
                        >
                          Candidate Dashboard
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => navigate("/applied-jobs")}
                        >
                          Applied Jobs
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => navigate("/interview")}
                        >
                          Interview Practice
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => navigate("/my-interviews")}
                        >
                          My Interviews
                        </button>
                      </>
                    )}

                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
