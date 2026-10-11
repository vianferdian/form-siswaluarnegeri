import React from 'react';

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helper,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl transition-all
          placeholder:text-slate-400 focus:outline-none focus:bg-white
          ${error 
            ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}
          ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}
        `}
        {...props}
      />

      {helper && !error && <p className="text-[11px] text-slate-500">{helper}</p>}
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = '-- Pilih Opsi --',
  required = false,
  error,
  helper,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl transition-all
          focus:outline-none focus:bg-white appearance-none cursor-pointer
          ${error 
            ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}
          ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>

      {helper && !error && <p className="text-[11px] text-slate-500">{helper}</p>}
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  error,
  helper,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl transition-all
          placeholder:text-slate-400 focus:outline-none focus:bg-white
          ${error 
            ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}
          ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}
        `}
        {...props}
      />

      {helper && !error && <p className="text-[11px] text-slate-500">{helper}</p>}
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export default FormInput;
