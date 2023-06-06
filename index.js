const express = require('express');
const app = express();
require('./db/conn')

// Routes for models
const accountRoutes = require('./routes/accountRoutes')
// Transaction routes


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/account', accountRoutes)


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

