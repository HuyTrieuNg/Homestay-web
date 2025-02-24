// import {Route, Redirect} from "react-router-dom"
// import {useContext} from "react"
// import AuthContext from "../context/AuthContext"


// const PrivateRoute = ({children, ...rest}) => {
//     let {user} = useContext(AuthContext)
//     return <Route {...rest}>{!user ? <Redirect to="/login" /> : children}</Route>
// }

// export default PrivateRoute

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// const PrivateRoute = ({ children }) => {
//   let { user } = useContext(AuthContext);
//   return user ? children : <Navigate to="/login" />;
// };

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
      return <div>Loading...</div>;  // Hoặc hiện spinner
  }

  return user ? children : <Navigate to="/login" replace />;
};


export default PrivateRoute;