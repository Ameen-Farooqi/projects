// email validator
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// password validator
const validatePassword = (password) => {
  const minLength = 6;
  const maxLength = 20;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  return (
    password.length >= minLength &&
    password.length <= maxLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
};

// validate phone
const validatePhone = (phone) => {
  const re = /^\d{10}$/;
  return re.test(String(phone));
};

export { validateEmail, validatePassword, validatePhone };