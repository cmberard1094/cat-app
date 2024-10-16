import { createContext, useState } from "react";
import { UserDetails, UserDetailsDefault } from "../types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserContextDetails {
  userDetails: UserDetails | undefined;
  updateUserDetails: (details: UserDetails) => void;
}

const UserContext = createContext<UserContextDetails>({
  userDetails: UserDetailsDefault,
  updateUserDetails: (details: UserDetails) => {},
});

interface UserProviderProps {
  children: React.ReactNode;
  initialUserDetails: UserDetails | undefined;
}

export const UserProvider = ({
  children,
  initialUserDetails,
}: UserProviderProps) => {
  const [userDetails, setUserDetails] = useState(
    initialUserDetails || UserDetailsDefault
  );

  const updateUserDetails = (details: UserDetails) => {
    AsyncStorage.setItem("sign-in-details", JSON.stringify(details));
    setUserDetails(details);
  };

  return (
    <UserContext.Provider value={{ userDetails, updateUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;

export default UserContext;
