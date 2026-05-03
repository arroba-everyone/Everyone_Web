export type Role = 'user' | 'admin';

export interface Session {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
}
