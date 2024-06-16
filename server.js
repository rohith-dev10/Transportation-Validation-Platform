const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose=require('mongoose')
const authRoutes = require('./src/routes/auth.js');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({ "result": "Success!" })
})

app.use('/api/auth', authRoutes);
app.use('/api/users', require('./src/routes/user.js'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));