const express = require('express');
const app = express();
const UserRoute = require('./src/routes/user.route');


require('dotenv').config();




app.use(express.json());
app.use('/user', UserRoute);




app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

