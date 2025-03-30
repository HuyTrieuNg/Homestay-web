// import {Route, Redirect} from "react-router-dom"
// import {useContext} from "react"
// import AuthContext from "../context/AuthContext"

// const PrivateRoute = ({children, ...rest}) => {
//     let {user} = useContext(AuthContext)
//     return <Route {...rest}>{!user ? <Redirect to="/login" /> : children}</Route>
// }

// export default PrivateRoute

import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PropTypes from "prop-types";

const PrivateRoute = ({ requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị spinner hoặc thông báo đang tải
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.type !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  requiredRole: PropTypes.string,
};

export default PrivateRoute;
