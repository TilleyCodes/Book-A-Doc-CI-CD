// Function to calculate password strength
export const calculatePasswordStrength = (pass) => {
  if (!pass) return '';
  if (pass.length < 10) return 'weak';
  if (/^[a-zA-Z0-9]+$/.test(pass)) return 'medium';
  return 'strong';
};
