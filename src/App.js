import React, { useState, useRef, useMemo } from "react";
import logo from "./assets/pitchcraft.jpeg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Grid, Paper, Typography } from "@mui/material";

import SimpleMenu from "./components/SimpleMenu";
import Score from "./components/Score";
import { targetAudience, domains, goals } from "./utils";

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const [selectedTargetAudience, setSelectedTargetAudience] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log({
    selectedTargetAudience,
    selectedDomain,
    selectedGoal,
    responseData,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/mp4",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleStopRecording = async () => {
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const handleUploadToBackend = async () => {
    setLoading(true);
    const videoBlob = new Blob(recordedChunks, { type: "video/mp4" });

    // Convert Blob to File
    const videoFile = new File([videoBlob], "video_file.mp4");

    // Create FormData to send the video file
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("goal", selectedGoal);
    formData.append("domain", selectedDomain);
    formData.append("target_audience", selectedTargetAudience);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const responseData = await response.json();
      console.log("Upload successful:", responseData);
      // set the response data
      let parsedData = JSON.parse(JSON.stringify(responseData));
      setResponseData(parsedData.result);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  // check if any of the selections are invalid
  const invalidSelections = useMemo(() => {
    return !selectedDomain || !selectedGoal || !selectedTargetAudience
      ? true
      : false;
  }, [selectedDomain, selectedGoal, selectedTargetAudience]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#d0cdc6]">
      {/* image */}
      {!loading && !responseData && (
        <div>
          <div className="animate-up-down items-center flex flex-col">
            <img src={logo} alt="" width={200} />
          </div>
          {/* input params for the score */}
          <div className="flex flex-row items-center">
            <SimpleMenu
              options={targetAudience}
              setOption={setSelectedTargetAudience}
              option={selectedTargetAudience}
              label="Target Audience"
            />
            {/* */}
            <SimpleMenu
              options={domains}
              setOption={setSelectedDomain}
              option={selectedDomain}
              label="Selected Domain"
            />
            {/* goals */}
            <SimpleMenu
              options={goals}
              option={selectedGoal}
              setOption={setSelectedGoal}
              label="Goal"
            />
          </div>
          <div className="items-center flex flex-col">
            <h1 className="text-3xl font-bold mb-6 items-center">
              Record Video
            </h1>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="border rounded-lg mb-4 w-80 items-center"
            />
            <div className="mb-4 font-semibold">Preview</div>
            <div className="flex space-x-4 mb-4">
              {isRecording ? (
                <button
                  onClick={handleStopRecording}
                  className="bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-lg hover:bg-red-500 transition"
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={handleStartRecording}
                  className="bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-lg hover:bg-green-500 transition"
                >
                  Start Recording
                </button>
              )}
            </div>
            <button
              onClick={handleUploadToBackend}
              disabled={recordedChunks.length === 0 || invalidSelections}
              className={`${
                recordedChunks.length === 0
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-500"
              } text-white font-semibold py-2 px-4 rounded shadow-lg transition`}
            >
              Get Scores!
            </button>
          </div>
        </div>
      )}
      {loading && <>fetching scores!</>}

      {!loading && responseData && (
        <div className="flex flex-col items-center justify-center mb-10">
          <Score value={responseData.score} />

          <Grid container spacing={4}>
            {/* Grid item 1 */}
            {/* <Grid item xs={6} className="flex justify-center">
              <Score value={responseData.score} />
            </Grid> */}
            <Grid item xs={6} className="flex justify-center">
              <div className="mb-10">
                <div className="mb-4 font-bold">
                  <h2 className="text-center">Projected outcome</h2>
                </div>
                <div>{responseData.projected_outcome}</div>
              </div>
            </Grid>
            <Grid item xs={6} className="flex justify-center align-center">
              <div className="mb-10">
                <div className="mb-4 font-bold">
                  <h2 className="text-center">General Feedback</h2>
                </div>
                <div>{responseData.feedback}</div>
              </div>
            </Grid>
            <Grid item xs={6} className="flex justify-center">
              <div className="mb-10">
                <div className="mb-4 font-bold">
                  <h2 className="text-center">Body Language Comments</h2>
                </div>
                <div>{responseData.body_language_comments}</div>
              </div>
            </Grid>
            <Grid item xs={6} className="flex justify-center">
              <div className="mb-10">
                <div className="mb-4 font-bold">
                  <h2 className="text-center">Sales Strategies</h2>
                </div>
                <div>{responseData.sales_strategies}</div>
              </div>
            </Grid>
            <Grid item xs={6} className="flex justify-center">
              <div className="mb-10">
                <div className="mb-4 font-bold">
                  <h2 className="text-center">Suggestions</h2>
                </div>
                <div>{responseData.suggestions}</div>
              </div>
            </Grid>
            <Grid item xs={6} className="flex justify-center">
              <div className="mb-10">
                <div className="mb-4 font-bold">
                  <h2 className="text-center">Comparison</h2>
                </div>
                <div>{responseData.comparison}</div>
              </div>
            </Grid>
          </Grid>
        </div>

        // <div className="flex flex-col items-center m-10">

        // </div>
      )}
    </div>
  );
}

export default App;
