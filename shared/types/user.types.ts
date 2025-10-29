export interface User {
  _id?: string;
  username: string;
  type: 'guest' | 'user';
  createdAt?: Date;
}

export interface AuthUser extends User {
  password: string;
}