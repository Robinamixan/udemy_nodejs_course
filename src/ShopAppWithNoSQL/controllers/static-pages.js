exports.getNotFound = (request, response, next) => {
  response.status(404);
  response.render('404', {
    pageTitle: 'Page Not Found'
  });
};

exports.get500 = (request, response, next) => {
  response.status(500);
  response.render('500', {
    pageTitle: 'Error page'
  });
};
