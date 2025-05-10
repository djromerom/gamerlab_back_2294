/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate if email is a valid Uninorte institutional email
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is a valid Uninorte email
 */
export const isUninorteEmail = (email) => {
  if (!email) return false;
  
  return email.endsWith('@uninorte.edu.co');
};

/**
 * Validate GitHub username format
 * @param {string} username - GitHub username to validate
 * @returns {boolean} True if username is valid
 */
export const isValidGithubUsername = (username) => {
  if (!username) return false;
  
  // GitHub usernames can only contain alphanumeric characters and hyphens
  // and cannot begin or end with a hyphen
  const githubRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9]))*$/;
  return githubRegex.test(username);
};

/**
 * Validate if a string has a minimum length
 * @param {string} str - String to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} True if string is valid
 */
export const hasMinLength = (str, minLength) => {
  if (!str) return false;
  
  return str.length >= minLength;
};

/**
 * Validate if a string has a maximum length
 * @param {string} str - String to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if string is valid
 */
export const hasMaxLength = (str, maxLength) => {
  if (!str) return true; // Empty string is valid in this case
  
  return str.length <= maxLength;
};