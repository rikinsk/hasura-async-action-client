import React, { ChangeEvent, useState } from "react";
import "./App.css";
import AsyncActionClient from "./AsyncActionClient";
import { APP_ASYNC_ACTIONS } from "./AsyncActions";
import { HASURA_ADMIN_SECRET, HASURA_ENDPOINT } from "./HasuraConfig";

function App() {
  const [sleepTime, setSleepTime] = useState(5);
  const [sleepResponse, setSleepResponse] = useState("No request made");

  const asyncHandler = new AsyncActionClient(
    HASURA_ENDPOINT,
    HASURA_ADMIN_SECRET,
    APP_ASYNC_ACTIONS
  );

  const triggerSleep = () => {
    asyncHandler.callAsyncAction(
      "sleepyAction",
      { sleep: sleepTime },
      setSleepResponse
    );
    setSleepResponse("Requesting...");
  };

  const handleSleepTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedVal = parseInt(e.target.value);
    setSleepTime(isNaN(parsedVal) ? 0 : parsedVal);
  };

  return (
    <div className="App">
      <h1>Async action tester</h1>
      <h2>Request</h2>
      <span style={{ marginRight: "20px" }}>
        Enter time for async action to sleep:
      </span>
      <input
        type="text"
        value={sleepTime}
        onChange={handleSleepTimeChange}
        style={{ marginRight: "20px" }}
      />
      <button onClick={triggerSleep}>Send request</button>
      <br />
      <h2>Response</h2>
      <div>{sleepResponse}</div>
    </div>
  );
}

export default App;
