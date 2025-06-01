import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from 'react-use';
import { defaultUserJwtData, UserJwtContext } from '../hooks/useUserJwtData';

export function UserJwtProvider({ children }) {
  const [userJwtData, setUserJwtData] = useState(defaultUserJwtData);
  const [jwtsPersisted, setJwtsPersisted] = useLocalStorage('jwts', defaultUserJwtData);

  useEffect(() => {
    setJwtsPersisted(userJwtData);
  }, [setJwtsPersisted, userJwtData]);

  useEffect(() => {
    // Only set from localStorage if we have valid data
    if (jwtsPersisted && Object.keys(jwtsPersisted).length > 0) {
      setUserJwtData(jwtsPersisted);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Using useMemo to prevent creating a new object on each render
  const contextValue = useMemo(() => ({
    userJwtData,
    setUserJwtData,
  }), [userJwtData]);

  return (
    <UserJwtContext.Provider value={contextValue}>
      {children}
    </UserJwtContext.Provider>
  );
}

UserJwtProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
