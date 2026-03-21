import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { BsChevronDown } from "react-icons/bs";

const Navbar = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [subLinks, setSubLinks] = useState([]);
  const [loadiing, setLoading] = useState(false);

  const matchRoute = (route) => {
    return matchPath(route, location?.pathname);
  };

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log(res.data.allCategory);
      setSubLinks(res.data.allCategory);
    } catch (error) {
      console.log("could not fetch category data ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  console.log(subLinks);

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-10/12 max-w-maxContent justify-between items-center">
        {/* logo */}
        <Link to="/">
          <img src={logo} alt="" width={160} height={32} loading="lazy" />
        </Link>

        {/* Navigation links */}
        <nav className="md:block hidden">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div className={`group relative flex items-center gap-1 cursor-pointer  ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}>
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className=" invisible absolute top-[50%] left-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {subLinks.map((link, i) => (
                          <p key={i}>{link.name}</p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="md:flex hidden items-center gap-x-4">
          {token === null && (
            <Link to={"/login"}>
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[6px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[6px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
