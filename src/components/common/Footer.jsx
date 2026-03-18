import React from "react";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa6";

const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* section */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <img src={Logo} alt="" className="object-contain" />
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                    {["About","Carrers","Affilates"].map((ele,i)=>(
                        <div key={i}
                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                            <Link to={ele.toLowerCase()}>{ele}</Link>
                        </div>
                    ))}
              </div>
              <div className="flex text-lg gap-3 ">
                    <FaFacebook/>
                    <FaGoogle/>
                    <FaTwitter/>
                    <FaYoutube/>
              </div>
              <div></div>
            </div>
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                <h1 className="text-richblack-50 font-semibold text-[16px]">
                    Resources
                </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
