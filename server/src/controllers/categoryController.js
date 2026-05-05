const categoryModel = require("../models/categoryModel");
const { isValid, isValidName } = require("../utils/validator");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const createCategory = async (req, res) => {
  try {
    // data fetch req body
    let { name, description } = req.body;

    //validate data
    if (!isValid(name) || !isValidName(name)) {
      return res
        .status(400)
        .json({ success: false, msg: "Name is required or invalid" });
    }

    if (!isValid(description)) {
      return res
        .status(400)
        .json({ success: false, msg: "description is required or invalid" });
    }

    const newCategory = await categoryModel.create({ name, description });
    return res
      .status(201)
      .json({ success: true, msg: "Tag created successfully", newCategory });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "something went wrong while creating tag" });
  }
};

const getAllCategory = async (req, res) => {
  try {
    console.log("INSIDE SHOW ALL CATEGORIES");
    const allCategorys = await categoryModel.find({});
    return res
      .status(200)
      .json({
        success: true,
        msg: "getting all successfully",
        data: allCategorys,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong while geting all tag",
    });
  }
};

const categoryPageDetails = async (req, res) => {
  try {
    //get category id
    let { categoryId } = req.body;

    if (!isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid category id",
      });
    }

    //get course for specific category
    const selectedCategory = await categoryModel.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    //validation
    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, msg: "Selected Category Not Found !" });
    }

    if (selectedCategory.course.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    //get course for different category
    const categoriesExceptSelected = await categoryModel.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await categoryModel
      .findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id,
      )
      .populate({
        path: "course",
        match: { status: "Published" },
      })
      .exec();

    //get top selling courses
    const allCategories = await categoryModel
      .find()
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.course);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    console.log("mostSellingCourses COURSE", mostSellingCourses)

    //return res
    return res.status(200).json({
      success: true,
      msg: "successfully fetching category page details",
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong, while fetching category page details",
    });
  }
};

module.exports = { createCategory, getAllCategory, categoryPageDetails };
