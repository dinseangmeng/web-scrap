require("dotenv").config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const authenticate = require("./middleware/authentication");
const apiRouter = require("./router/api/index");

const app = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'router/web'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

app.use('/api', authenticate, apiRouter);
app.use('/api-docs', authenticate, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.render('index');
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});