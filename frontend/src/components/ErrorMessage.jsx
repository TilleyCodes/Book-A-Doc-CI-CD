import React from 'react';
import PropTypes from 'prop-types';

export function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert">
      {message}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
