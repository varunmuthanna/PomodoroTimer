import React from "react";
import "./PomodoroClock.css";

const formatTime = sec =>
  Math.floor(sec / 60) + ":" + ("0" + sec % 60).slice(-2);

const labelColor = state => {
  switch (state) {
    case "Start":
      return { color: "grey" };
    case "Progress":
      return { color: "green" };
    case "Break":
      return { color: "yellow" };
    case "Done":
      return { color: "Red" };
    case "Long Break":
      return { color: "orange" };
    case "Session End":
      return { color: "red" };
    default:
      return { color: "white" };
  }
};

export default ({ clockState, value }) => (
  <div
    className="container"
    style={{
      opacity: clockState === "Done" || clockState === "Session End" ? 0.5 : 1
    }}
  >
    <div
      className="clock-state"
      style={{ backgroundColor: labelColor(clockState).color }}
    >
      {clockState}
    </div>
    <div
      style={{
        background: `url(${require("./../../pomodoro.png")}) no-repeat center`,
        backgroundSize: "150px 175px"
      }}
      className="clock-container"
    >
      <div className="clock-timer">{formatTime(value)}</div>
    </div>
  </div>
);
