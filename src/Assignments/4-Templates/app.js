const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const usersRoutes = require('./routes/users');
const rootDir = require('./utils/rootDir');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use(adminData.router);
app.use(usersRoutes);

app.use((request, response, next) => {
  response.status(404);
  response.render('404', {
    pageTitle: 'Page Not Found',
    path: request.url
  });
});

app.listen(process.env.SECOND_INTERNAL_PORT);
