import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, helperText, icon: Icon, className = '', containerClass = '', ...props },
  ref
) {
  return (
    <div className={`flex flex-col gap-1 ${containerClass}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          {...props}
          className={`
            block w-full rounded-lg border text-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors duration-150
            ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2
            ${error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-300 bg-red-50'
              : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-200 bg-white'
            }
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
})

export default Input
