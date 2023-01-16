exports.getNotFound = (request, response, next) => {
  response.status(404);
  response.render('404', {
    pageTitle: 'Page Not Found'
  });
};
