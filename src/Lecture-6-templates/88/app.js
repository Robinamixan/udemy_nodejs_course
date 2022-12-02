const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./utils/rootDir');

const app = express();

// register new custom template engine where 'hbs' is engine name and file extension of view files
app.engine(
    'hbs',
    handlebars({
      layoutsDir: path.join(rootDir, 'views', 'layouts'),
      defaultLayout: 'main-layout',
      // should be added for correct file extension of layouts
      extname: 'hbs'
    })
);
// set template engine //
app.set('view engine', 'hbs');
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
  response.render('404', {pageTitle: 'Page Not Found'});
});

app.listen(process.env.SECOND_INTERNAL_PORT);
