import { apiPost } from './api';

export const loginUser = ({ email, password, role }) =>
  apiPost('/auth/login', { email, password, role });

export const registerUser = ({ email, password, role, name }) =>
  apiPost('/auth/register', { email, password, role, name });
