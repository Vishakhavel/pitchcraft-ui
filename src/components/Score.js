import React from "react";
import { Box, Typography } from "@mui/material";

const Score = ({ value }) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 10; // Width of the pie chart stroke

  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;

  // Calculate the offset based on the value
  const progress = (value / 10) * circumference;
  const offset = circumference - progress;

  return (
    <Box
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="lightgray"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="blue" // Change this to your desired color
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ transform: "translate(-50%, -50%)" }}
      >
        <Typography variant="h5" component="div" color="text.secondary">
          {value}
        </Typography>
        /10
      </Box>
      {/* /10 */}
    </Box>
  );
};

export default Score;
