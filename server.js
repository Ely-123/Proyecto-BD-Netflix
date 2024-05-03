const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");
const oracledb = require('oracledb');

const app = express();

app.use(cors());
app.use(express.json());

async function connectToDatabase() {
  try {
    await oracledb.createPool({
      user: 'Alexander2010',
      password: 'Netflix-2001-2024',
      connectString: 'Alexander2010/Netflix-2001-2024@hostname:puerto/SID',
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

connectToDatabase();

app.use("/api/user", userRoutes);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
