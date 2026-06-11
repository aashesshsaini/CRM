import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select...', containerClass = '', className = '', ...props },
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
        <select
          ref={ref}
          {...props}
          className={`
            block w-full rounded-lg border text-sm appearance-none
            pl-3 pr-8 py-2
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-colors duration-150
            ${error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-300 bg-red-50'
              : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-200 bg-white'
            }
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>{opt}</option>
            ) : (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )
          )}
        </select>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})

export default Select
