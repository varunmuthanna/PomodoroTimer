import React, { Component } from "react";
import tomato from "./../../pomodoro.png";
import PomodoroClock from "./../PomodoroClock/PomodoroClock.js";
import "./../../App.css";
import "./PomodoroApp.css";

class PomodoroApp extends Component {
  state = {
    numClocks: 1,
    clocks: [
      {
        id: 1,
        secondsLeft: 1500,
        clockState: "Start",
        increment: null
      },
      {
        id: 5,
        secondsLeft: 900,
        clockState: "Long Break",
        increment: null
      }
    ],
    current: -1,
    isPaused: false,
    clocksDone: 0,
    sessionStart: false
  };

  renderClocks = () => {
    const clocks = this.state.clocks.filter(clock => clock.id !== 5);
    const rows = [];
    for (let i = 0; i < clocks.length; i++) {
      rows.push(
      <PomodoroClock
        key={i}
        value={clocks[i].secondsLeft}
        onClick={() => this.handleClick(clocks[i].id)}
        clockState={clocks[i].clockState}
      />
      );
    }
    return rows;
  };

  setClockState = (i, newState) => {
    let { clocks } = this.state;
    const clock = clocks.filter(clock => clock.id === i)[0];
    clock.clockState = newState;
    this.setState({
      clocks
    });
  };

  decrementTime = (i, pauseSession = false) => {
    const { clocks, numClocks } = this.state;
    const clock = clocks.filter(clock => clock.id === i)[0];

    clock.secondsLeft -= 1;

    if (clock.secondsLeft <= 0) {
      if (clock.clockState === "Progress") {
        clock.secondsLeft = 300;
        this.setClockState(i, "Break");
      } else if (clock.clockState === "Break") {
        clock.secondsLeft = 0;
        this.setClockState(i, "Done");
        this.setState(prevState => ({
            clocksDone: prevState.clocksDone + 1
        }));
        if (i < numClocks) {
          this.startClock(i + 1);
        } else {
          this.startClock(5);
        }
        clearInterval(clock.increment);
      }
      if (clock.clockState === "Long Break") {
        clock.secondsLeft = 0;
        this.setClockState(i, "Session End");
        this.setState({ sessionStart: false });
        clearInterval(clock.increment);
      }
    }

    this.setState({ clocks });
  };

    startClock = i => {
      const { clocks, isPaused } = this.state;
      const clock = clocks.filter(clock => clock.id === i)[0];
      if (clock.clockState === "Start") {
        this.setClockState(i, "Progress");
        clock.increment = setInterval(() => this.decrementTime(i), 1000);
      } else if (clock.clockState === "Long Break" || isPaused) {
        clock.increment = setInterval(() => this.decrementTime(i), 1000);
      }
      this.setState({ sessionStart: true, current: i });
    };

    handleClick = i => {
      this.startClock(i);
    };

    handleAddPomodoro = () => {
      let { clocks, numClocks } = this.state;

      if (numClocks === 4) return;
      const newClock = {
        id: this.state.clocks.length,
        secondsLeft: 1500,
        clockState: "Start",
        increment: null
      };

      numClocks += 1;

      this.setState({
        numClocks: numClocks,
        clocks: [...clocks, newClock]
      });
    };

  resetPomodoros = () => {
    const { numClocks, clocks } = this.state;
    for (let i = 0; i < numClocks; i++) {
      clearInterval(clocks[i].increment);
    }
    this.setState({
      numClocks: 1,
      clocks: [
        {
          id: 1,
          secondsLeft: 1500,
          clockState: "Start",
          increment: null
        },
        {
          id: 5,
          secondsLeft: 900,
          clockState: "Long Break",
          increment: null
        }
      ],
      current: -1,
      isPaused: false,
      clocksDone: 0,
      sessionStart: false
    });
  };

  pauseSession = () => {
    const { isPaused, clocks, current } = this.state;
    const runningClock = clocks.filter(clock => clock.id === current)[0];
    if (!isPaused) {
      clearInterval(runningClock.increment);
      this.setState({ isPaused: true });
    } else {
      if (runningClock.clockState !== "Session End") {
        this.startClock(current);
        this.setState({ isPaused: false });
      } else {
        this.setState({
          isPaused: false,
          sessionStart: false
        });
      }
    }
  };

  render() {
    let toRender;
    if (
      this.state.numClocks > 4 ||
      this.state.clocksDone === this.state.numClocks
    ) {
      const breakClock = this.state.clocks.filter(clock => clock.id === 5)[0];
      toRender = (
        <div className="clocks-container">
          <PomodoroClock
            value={breakClock.secondsLeft}
            clockState={breakClock.clockState}
          />
        </div>
      );
    } else {
      toRender = <div className="clocks-container">{this.renderClocks()}</div>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={tomato} className="App-logo" alt="logo" />
          <h1 className="App-title">Pomodoro Timer</h1>
        </header>
        {toRender}
        <div>
          <button
            className="btn"
            style={{
              backgroundColor: "#17a2b8"
            }}
            disabled={this.state.sessionStart}
            onClick={() => this.startClock(1)}
          >
            Start Session
          </button>
          <button
            style={{
              backgroundColor: "#ffc107"
            }}
            onClick={this.pauseSession}
            className="btn"
            disabled={!this.state.sessionStart}
          >
            {this.state.isPaused ? "Un-Pause" : "Pause"} Session
          </button>
          <button
            className="btn"
            style={{ backgroundColor: "#007bff" }}
            onClick={this.handleAddPomodoro}
            disabled={
              this.state.numClocks === 4 ||
              this.state.clocksDone === this.state.numClocks
            }
          >
            Add Pomodoro Clock
          </button>
          <button
            style={{ backgroundColor: "#bc2b23" }}
            className="btn"
            onClick={this.resetPomodoros}
          >
            Reset Clocks
          </button>
        </div>
      </div>
    );
  }
}

export default PomodoroApp;
