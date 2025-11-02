export type UserRole = "client" | "hr" | "admin";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface PublicUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ContactRecord {
  _id: string;
  client: PublicUser;
  hr: PublicUser;
  createdAt: string;
}


