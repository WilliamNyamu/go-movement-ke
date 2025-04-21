import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, FileText, Calendar, Image, LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const [adminEmail, setAdminEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const email = localStorage.getItem("adminEmail"); // Assuming admin email is stored in localStorage

    if (!authToken) {
      navigate("/go-admin/login");
    } else {
      setAdminEmail(email || "Admin"); // Fallback to "Admin" if email is not available
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminEmail");
    navigate("/go-admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
          <div className="flex items-center justify-center h-14">
            <span className="text-xl font-bold text-purple-600 fontleading">Admin Panel</span>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-2">
              <NavLink
                to="/go-admin/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-md ${
                    isActive
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Home className="h-5 w-5 mr-3" />
                Dashboard
              </NavLink>
              <NavLink
                to="/go-admin/articles"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-md ${
                    isActive
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <FileText className="h-5 w-5 mr-3" />
                Articles
              </NavLink>
              <NavLink
                to="/go-admin/events"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-md ${
                    isActive
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Calendar className="h-5 w-5 mr-3" />
                Events
              </NavLink>
              <NavLink
                to="/go-admin/gallery"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-md ${
                    isActive
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Image className="h-5 w-5 mr-3" />
                Gallery
              </NavLink>
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  {adminEmail}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
