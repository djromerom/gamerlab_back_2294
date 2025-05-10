/**
 * Format a date to a localized string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format a date and time to a localized string
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return new Date(date).toLocaleString(undefined, defaultOptions);
};

/**
 * Format estado enum to a more readable string
 * @param {string} estado - Estado enum value
 * @returns {string} Formatted estado
 */
export const formatEstado = (estado) => {
  if (!estado) return '';
  
  return estado.replace('_', ' ');
};