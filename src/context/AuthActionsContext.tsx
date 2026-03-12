import React from 'react';

type AuthActionsContextType = {
  onSignOut: () => Promise<void>;
};

const AuthActionsContext = React.createContext<AuthActionsContextType>({
  onSignOut: async () => {},
});

export const useAuthActions = () => React.useContext(AuthActionsContext);
export default AuthActionsContext;