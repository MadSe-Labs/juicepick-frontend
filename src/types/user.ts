type RoleTypes = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: RoleTypes;
}
