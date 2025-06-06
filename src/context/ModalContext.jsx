import { createContext, useContext, useState } from 'react';

const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  let loginSuccessCallback = null;
  
  const openLoginModal = (options = {}) => {
    loginSuccessCallback = options.onLoginSuccess;
    setLoginModalOpen(true);
  };
  
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };
  
  const handleLoginSuccess = () => {
    closeLoginModal();
    if (typeof loginSuccessCallback === 'function') {
      loginSuccessCallback();
    }
  };
  
  const value = {
    openLoginModal,
    loginModalOpen,
    closeLoginModal,
    handleLoginSuccess
  };
  
  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);