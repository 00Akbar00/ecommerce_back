const express = require("express");
const  connectDB  = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;
const apiRoutes = require('./routes');

connectDB();

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
