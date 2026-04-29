import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const SelectTag = ({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const [chips, setChips] = useState([]);

  // register field manually
  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  //sync chips → form
  useEffect(() => {
    setValue(name, chips);
  }, [chips, setValue, name]);

  // add tag
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault(); //important

      const chipValue = event.target.value.trim();

      if (chipValue && !chips.includes(chipValue)) {
        setChips([...chips, chipValue]);
        event.target.value = "";
      }
    }
  };

  // remove tag
  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex w-full flex-wrap gap-y-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {chip}
            <button
              type="button"
              className="ml-2"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose />
            </button>
          </div>
        ))}

        <input
          id={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default SelectTag;