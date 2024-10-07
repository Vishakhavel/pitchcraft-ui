import React, { useState } from "react";
// import { Button, Menu, MenuItem } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SimpleMenu = ({ options = [], setOption, option, label }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  return (
    <div>
      {/* <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <div className="font-semibold">{label}</div>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map(({ key, value }) => (
          <MenuItem
            key={key}
            onClick={() => handleSelect(value)}
            selected={selectedOption === value} // Highlight the selected option
          >
            {value}
          </MenuItem>
        ))}
      </Menu>
      {selectedOption && <p>Selected: {selectedOption}</p>} */}
      <FormControl fullWidth>
        <InputLabel id="simple-dropdown-label">{label}</InputLabel>
        <Select
          labelId="simple-dropdown-label"
          value={option}
          onChange={handleChange}
          label="Select an Option"
          className="w-[200px] mr-20 mb-20"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {/* <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem> */}
          {options.map(({ key, value }) => (
            <MenuItem key={key} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SimpleMenu;
