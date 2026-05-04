import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenRoute from "../src/components/core/auth/OpenRoute";
import PrivateRoute from "../src/components/core/auth/PrivatRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/updatePassword";
import VerifyEmail from "./pages/verifyEmail";
import MyProfile from "./components/core/Dashboard/MyProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart from "./components/core/Dashboard/Cart/Index";
import Error from './pages/Error'
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";

function App() {
  const { user } = useSelector((state) => state.profile);
  
  return (
    <div className="flex flex-col w-screen min-h-screen bg-richblack-900 font-inter ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="dashboard/cart" element={<Cart/>}/>
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
            <Route path="dashboard/add-course" element={<AddCourse/>}/>
            <Route path="dashboard/my-courses" element={<MyCourses/>}/>
            <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>
         <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
