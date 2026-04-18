// NavbarContext.tsx
import React, { createContext, useContext, useState } from 'react';

const NavbarContext = createContext({
  visible: true,
  setVisible: (v: boolean) => {},
});

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(true);
  return (
    <NavbarContext.Provider value={{ visible, setVisible }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);