const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./utils/rootDir');

const app = express();

// set template engine //
app.set('view engine', 'ejs');
// set folder with templates //
app.set('views', path.join(rootDir, 'views'));
// set body parser for all input requests //
app.use(bodyParser.urlencoded({extended: false}));
// set folder with public files //
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use((request, response, next) => {
  response.status(404);
  response.render('404', {
    pageTitle: 'Page Not Found',
    path: request.url
  });
});

app.listen(process.env.SECOND_INTERNAL_PORT);
