import { Children, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const PrivateRoute = ({ children, allowedRoles}) => {
    const { user, isAuthenticated } = useContext(AuthContext);

    if(!AuthContext){
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

    return children;
}

// without role boased 
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useContext(AuthContext);
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

export default PrivateRoute;
