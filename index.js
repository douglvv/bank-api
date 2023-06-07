const express = require('express');
const app = express();
require('./db/conn')

// Routes
const accountRoutes = require('./routes/accountRoutes')

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/account', accountRoutes)


const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };

