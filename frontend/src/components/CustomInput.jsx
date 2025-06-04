import React, { forwardRef } from 'react';

export const CustomInput = forwardRef(
  ({
    value,
    onClick,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    labelText,
    id,
  }, ref) => (
    <div className="input-wrapper" style={{ position: 'relative' }}>
      <input
        ref={ref}
        className="input-field"
        placeholder={placeholder || ''}
        value={value}
        onClick={onClick}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ width: '100%' }}
      />
      <label className="input-label" htmlFor={id}>
        {labelText}
      </label>
    </div>
  ),
);

// Add display name for better debugging
CustomInput.displayName = 'CustomInput';
