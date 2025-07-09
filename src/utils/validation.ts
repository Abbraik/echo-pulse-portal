// Validation utilities used across forms

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
};

export const validateRange = (value: number, min: number, max: number, fieldName: string): string | null => {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

export const validateBundleForm = (formData: any): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameError = validateRequired(formData.name, 'Bundle name');
  if (nameError) errors.name = nameError;

  const summaryError = validateRequired(formData.summary, 'Summary');
  if (summaryError) errors.summary = summaryError;

  if (formData.name && formData.name.length > 100) {
    errors.name = 'Bundle name must be no more than 100 characters';
  }

  if (formData.summary && formData.summary.length > 500) {
    errors.summary = 'Summary must be no more than 500 characters';
  }

  if (!formData.objectives || formData.objectives.length === 0) {
    errors.objectives = 'At least one objective is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};