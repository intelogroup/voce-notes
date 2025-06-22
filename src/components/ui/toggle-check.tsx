import React from "react";

interface ToggleCheckProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const ToggleCheck: React.FC<ToggleCheckProps> = ({ checked, onChange, disabled, className }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      tabIndex={0}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center px-1 ${checked ? 'bg-emerald-500' : 'bg-gray-300'} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className || ''}`}
      style={{ minWidth: 48, minHeight: 28 }}
    >
      <span
        className={`absolute left-1 top-1/2 transform -translate-y-1/2 transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      >
        <span className="block w-5 h-5 bg-white rounded-full shadow flex items-center justify-center">
          {checked && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle">
              <polyline points="20 6 10 17 4 11" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}; 