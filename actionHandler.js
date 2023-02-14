const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// paste the code from codegen here

// Request Handler
app.post("/sleepyAction", async (req, res) => {
  // get request input
  const { sleep } = req.body.input;

  // run some business logic

  console.log("Sleeping...");

  await new Promise((resolve) => setTimeout(resolve, sleep * 1000));

  console.log("Slept for " + sleep + " seconds");

  // success
  return res.json({
    msg: "Slept for " + sleep + " seconds",
    status: "success",
  });
});

app.get("/", async (req, res) => {
  return res.json({
    app: "running",
  });
});

app.listen(PORT);
