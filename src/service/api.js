// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://attendance-system-fwt8.onrender.com/',
});

export default instance;