export type UserDetails = {
  userName: string;
  password: string;
  sessionActive: boolean;
};

export const UserDetailsDefault: UserDetails = {
  userName: "",
  password: "",
  sessionActive: false,
};
