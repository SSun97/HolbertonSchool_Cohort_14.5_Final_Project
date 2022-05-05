export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.remove();
};
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 4000);
};
