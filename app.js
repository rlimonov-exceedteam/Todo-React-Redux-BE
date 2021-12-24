require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

const PORT = process.env.PORT || 8000;
const app = express();

const apiRoutes = require('./src/modules/routes/routes');

try {
  const url = process.env.DB_URL;
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch(error) {
  res.status(500).send('Internal server error');
}

app.use(bodyParser());
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use("/", apiRoutes);
app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,  X-PINGOTHER'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
});


app.listen(PORT, () => {
  console.log('App listening');
});