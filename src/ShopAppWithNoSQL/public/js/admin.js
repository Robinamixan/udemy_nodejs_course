const deleteProduct = (button) => {
  const productId = button.parentNode.querySelector('[name=productId]').value;
  const csrfToken = button.parentNode.querySelector('[name=_csrf]').value;

  const productElement = button.closest('article.product-item');

  fetch('/admin/products/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrfToken
    }
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      productElement.remove();
    })
    .catch(error => {
      console.log(error);
    });
};