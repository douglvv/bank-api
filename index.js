const express = require('express');
const app = express();
require('./db/conn')

// Routes for models
const accountRoutes = require('./routes/accountRoutes')
// Transaction routes


// Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


app.use('/account', accountRoutes)


const port = 3000;
// db.connect().then(() => { // Aplicação começa a ouvir após conectar no banco
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
// })

