import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Error from '../pages/Error'
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogaPageData } from "../services/operations/PageAndComponentData";

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  //Fetch all categories
  useEffect(()=>{
    
    const getCategories = async()=>{
      const res = await apiConnector("GET",categories.CATEGORIES_API);
      const matchedCategory = res?.data?.data?.find(
      (ct) =>
        ct.name.split(" ").join("-").toLowerCase() === catalogName
    );

    if (matchedCategory) {
      setCategoryId(matchedCategory._id);
    }
    
    }
    getCategories();
    // console.log(categoryId);
    
  },[catalogName])

  useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                console.log("Printing res: ", res);
                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);

  // if (loading || !catalogPageData) {
  //   return (
  //     <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
  //       <div className="spinner"></div>
  //     </div>
  //   );
  // }
  // if (!loading && !catalogPageData.success) {
  //   return <Error />;
  // }
  
  return (
    <>
    <div className=" box-content bg-richblack-800 px-4"> 
       <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          
       </div>

    </div>
    </>
  )
};

export default Catalog;
