import { ROLES } from '../constants/roles';

export const getDashboardPath = (role) => {
  if (role === ROLES.ADMIN) return '/admin';
  return '/dashboard';
};
