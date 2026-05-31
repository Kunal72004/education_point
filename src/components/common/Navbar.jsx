import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo/main_logo.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  const matchRoute = (route) => {
    return matchPath(route, location?.pathname);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  console.log("subLinks", subLinks);

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
                    <div
                      className={`group relative flex items-center gap-1 cursor-pointer  ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className=" invisible absolute top-[50%] left-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p>Loading...</p>
                        ) : subLinks && subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter((subLink) => subLink?.course?.length > 0)
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
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
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          {token === null && (
            <>
              <Link to="/login">
                <button className="whitespace-nowrap rounded-md border border-richblack-700 px-3 py-2 text-sm text-richblack-100">
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button className="whitespace-nowrap rounded-md bg-yellow-50 px-3 py-2 text-sm font-medium text-richblack-900">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {token !== null && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token !== null && <ProfileDropDown />}

          <button
            onClick={() => setOpenMenu(true)}
            className="text-richblack-5"
          >
            <AiOutlineMenu className="text-3xl" />
          </button>
        </div>
      </div>
      {/* Overlay */}
      {openMenu && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 md:hidden"
          onClick={() => setOpenMenu(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-[1000] h-screen w-[280px]
        border-l border-richblack-700 bg-richblack-800
        transition-all duration-300 md:hidden
        ${openMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setOpenMenu(false)}
          className="absolute right-4 top-4 text-richblack-5"
        >
          <RxCross2 className="text-3xl" />
        </button>

        <div className="mt-20 flex flex-col gap-6 px-6">
          <Link
          to="/home"
          onClick={() => setOpenMenu(false)}
          className="text-lg text-richblack-5"
        >
          Home
        </Link>
          <Link
            to="/about"
            onClick={() => setOpenMenu(false)}
            className="text-lg text-richblack-5"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={() => setOpenMenu(false)}
            className="text-lg text-richblack-5"
          >
            Contact Us
          </Link>

          <div>
            <p className="mb-3 text-lg text-richblack-5">
              Catalog
            </p>

            <div className="flex flex-col gap-2 pl-4">
              {subLinks
                ?.filter((subLink) => subLink?.course?.length > 0)
                ?.map((subLink, index) => (
                  <Link
                    key={index}
                    to={`/catalog/${subLink.name
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`}
                    onClick={() => setOpenMenu(false)}
                    className="text-richblack-300"
                  >
                    {subLink.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
  );
};

export default Navbar;
