const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const port = 8000;
const cors = require('cors');

const users = require('./routes/usersRoutes');
const recipes = require('./routes/recipeRoutes');
const comments = require('./routes/commentRoutes');

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', users);
app.use('/', recipes);
app.use('/', comments);

app.listen(port, () => {
	console.log('App is running...');
});
