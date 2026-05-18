const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('SportNest Server is running on Native MongoDB Driver!');
});

const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server is purring on port ${PORT}`);
    });
};

startServer();