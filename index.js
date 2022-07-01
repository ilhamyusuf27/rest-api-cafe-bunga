const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const port = process.env.PORT;
const cors = require('cors');

const users = require('./routes/usersRoutes');
const recipes = require('./routes/recipeRoutes');
const comments = require('./routes/commentRoutes');
const login = require('./routes/loginRoutes');

app.use(helmet());

app.use(cors({ origins: 'https://codepen.io/' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/images/recipes', express.static('images/recipes'));
app.use('/', users);
app.use('/', recipes);
app.use('/', comments);
app.use('/', login);

app.listen(port, () => {
	console.log('App is running...');
});
