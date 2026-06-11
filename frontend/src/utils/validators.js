export const phoneRegex = /^[6-9]\d{9}$/

export const validators = {
  required: (label = 'This field') => ({
    required: `${label} is required`,
  }),
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: phoneRegex,
      message: 'Enter a valid 10-digit mobile number',
    },
  },
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 60, message: 'Name too long' },
  },
}
