import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.status === 200) {
      showAlert('success', 'Login Successful!');
      window.setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
    // console.log(res);
  } catch (error) {
    showAlert('error', error.response.data.message);
    // console.log(error.response.data);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
