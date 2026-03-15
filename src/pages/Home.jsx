import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/homePage/HighlightText";
import CTAButton from "../components/core/homePage/Button";
import banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/homePage/CodeBlocks";

const Home = () => {
  return (
    <div>
      {/* section1 */}
      <div className="relative mx-auto flex w-10/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* become a instructor button */}
        <Link to={"/signup"}>
          <div className="group rounded-full bg-richblack-800 mt-16 p-1 mx-auto w-fit text-richblack-200 font-bold drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95">
            <div className="flex items-center rounded-full gap-2 px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* heading */}
        <div className="text-center font-semibold text-4xl">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        {/* subHeadin */}
        <div className="w-[90%] mt-3 text-richblack-300 text-center text-lg font-bold">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* CTAButton */}
        <div className="flex gap-7 mt-8 ">
          <CTAButton active={true} linkTo={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkTo={"/login"}>
            Book a Demo
          </CTAButton>
        </div>
        {/* video */}
        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200 ">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)] "
            muted
            loop
            autoPlay
            src={banner}
            typeof="video/mp4"
          ></video>
        </div>

        {/* code section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"Coding Potential"} /> with our Online
                Course
              </div>
            }
            subHeading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
            ctabtn1={{active:true,btnText:"Try it Yourself",link:"/signup"}}
            ctabtn2={{active:false,btnText:"Learn More",link:"/signup"}}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}

          />
        </div>
        {/* code section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"Coding in seconds"} />
              </div>
            }
            subHeading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
            ctabtn1={{active:true,btnText:"Continue Lesson",link:"/signup"}}
            ctabtn2={{active:false,btnText:"Learn More",link:"/signup"}}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        {/* Explore section */}
        
      </div>

      {/* seciotn2 */}

      {/* section3 */}

      {/* section4 */}
    </div>
  );
};

export default Home;
