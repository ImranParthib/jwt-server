export interface User {
  id: number;
  username: string;
  passwordHash: string;
}

// Pretend DB
export const users: User[] = [
  {
    id: 1,
    username: "testuser",
    passwordHash: require("bcryptjs").hashSync("password123", 8),
  },
];
