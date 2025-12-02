/**
 * @fileoverview
 * Generic Date Picker Component Suite
 * 
 * This file provides a set of reusable, easy-to-use date input components:
 *  - DatePicker: A single date input with label, helper text, and validation states.
 *  - DateRangePicker: Two linked date inputs for selecting a start and end date.
 *  - InlineDateRangePicker: A compact, inline version without labels.
 *  - DateInput: Minimal single date field without extra labels or text.
 * @author Susmitha
 * @date 01/11/2025
 * @since 1.0.0
 * These components are styled using Tailwind CSS for visual consistency and flexibility.
 */

import React from 'react';

/**
 * ✅ Single Date Picker Component
 * 
 * Displays a single date input with a label, error message, and helper text.
 * Perfect for selecting one date (e.g., "Date of Birth", "Appointment Date", etc.)
 *
 * @param {Object} props - Component props.
 * @param {string} [props.label] - The label text displayed above the date input.
 * @param {string} props.value - The current selected date (in "YYYY-MM-DD" format).
 * @param {Function} props.onChange - Function called when the user changes the date.
 * @param {string} [props.minDate] - The earliest selectable date.
 * @param {string} [props.maxDate] - The latest selectable date.
 * @param {boolean} [props.error] - If true, shows red border and error helper text.
 * @param {string} [props.helperText] - Text shown below the input (e.g., error message or hint).
 * @param {boolean} [props.fullWidth=false] - Makes the component expand to full container width.
 * @param {boolean} [props.required=false] - Marks the input as required with a red asterisk.
 * @param {boolean} [props.disabled=false] - Disables the input (makes it non-editable and grayed out).
 * @param {string} [props.className] - Additional CSS classes for customization.
 * @param {Object} [props.props] - Any other props passed to the HTML `<input>` element.
 */
export const DatePicker = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  helperText,
  fullWidth = false,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`inline-flex flex-col ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
      {/* Label Section */}
      {label && (
        <label className="text-xs font-normal text-gray-600 mb-1.5 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
        disabled={disabled}
        required={required}
        className={`
          px-3 py-2.5 
          border border-gray-300 
          rounded 
          text-sm text-gray-900
          bg-white
          focus:outline-none focus:border-gray-400 focus:ring-0
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'cursor-pointer'}
          hover:border-gray-400
        `}
        style={{
          colorScheme: 'light',
          minWidth: '160px',
        }}
        {...props}
      />

      {/* Helper Text or Error Message */}
      {helperText && (
        <span className={`text-xs mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
};

/**
 * ✅ Date Range Picker
 * 
 * Displays two DatePicker components side by side for selecting a start and end date.
 * Automatically restricts the "to" date to not be earlier than the "from" date.
 * 
 * Common use case: Selecting travel dates, project durations, event periods, etc.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.startLabel="Visit From"] - Label for the start date field.
 * @param {string} [props.endLabel="Visit To"] - Label for the end date field.
 * @param {string} props.startValue - The selected start date.
 * @param {string} props.endValue - The selected end date.
 * @param {Function} props.onStartChange - Called when the start date changes.
 * @param {Function} props.onEndChange - Called when the end date changes.
 * @param {string} [props.minDate] - The earliest allowed date.
 * @param {string} [props.maxDate] - The latest allowed date.
 * @param {boolean} [props.fullWidth=false] - Makes the component stretch across the container.
 * @param {boolean} [props.error] - If true, displays the helper text as an error message.
 * @param {string} [props.helperText] - Message shown when there’s an error or note.
 * @param {string} [props.className] - Extra CSS classes for layout customization.
 * @param {number} [props.gap=4] - Space (in Tailwind gap units) between the two fields.
 */
export const DateRangePicker = ({
  startLabel = "Visit From",
  endLabel = "Visit To",
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  minDate,
  maxDate,
  fullWidth = false,
  error,
  helperText,
  className = '',
  gap = 4,
}) => {
  return (
    <div className={`flex ${fullWidth ? 'w-full' : 'w-auto'} ${className}`} style={{ gap: `${gap * 0.25}rem` }}>
      {/* Start Date */}
      <div className={fullWidth ? 'flex-1' : 'w-auto'}>
        <DatePicker
          label={startLabel}
          value={startValue}
          onChange={onStartChange}
          minDate={minDate}
          maxDate={endValue || maxDate}
          error={error}
          helperText={error ? helperText : ''}
        />
      </div>

      {/* End Date */}
      <div className={fullWidth ? 'flex-1' : 'w-auto'}>
        <DatePicker
          label={endLabel}
          value={endValue}
          onChange={onEndChange}
          minDate={startValue || minDate}
          maxDate={maxDate}
        />
      </div>
    </div>
  );
};

/**
 * ✅ Inline Date Range Picker
 * 
 * A compact version of the DateRangePicker.
 * Designed for inline layouts where space is limited (e.g., search bars, filters).
 * 
 * Labels are replaced with placeholders for a minimalist design.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.startPlaceholder="Start Date"] - Placeholder text for the first input.
 * @param {string} [props.endPlaceholder="End Date"] - Placeholder text for the second input.
 * @param {string} props.startValue - The selected start date.
 * @param {string} props.endValue - The selected end date.
 * @param {Function} props.onStartChange - Called when the start date changes.
 * @param {Function} props.onEndChange - Called when the end date changes.
 * @param {string} [props.minDate] - Minimum selectable date.
 * @param {string} [props.maxDate] - Maximum selectable date.
 * @param {string} [props.className] - Custom class names for styling or layout tweaks.
 */
export const InlineDateRangePicker = ({
  startPlaceholder = "Start Date",
  endPlaceholder = "End Date",
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  minDate,
  maxDate,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Start Date Field */}
      <input
        type="date"
        value={startValue}
        onChange={(e) => onStartChange(e.target.value)}
        min={minDate}
        max={endValue || maxDate}
        placeholder={startPlaceholder}
        className="
          px-3 py-2.5 
          border border-gray-300 
          rounded 
          text-sm text-gray-900
          bg-white
          focus:outline-none focus:border-gray-400 focus:ring-0
          transition-colors
          hover:border-gray-400
          cursor-pointer
        "
        style={{ colorScheme: 'light', minWidth: '160px' }}
      />

      {/* Separator */}
      <span className="text-gray-400 text-sm">to</span>

      {/* End Date Field */}
      <input
        type="date"
        value={endValue}
        onChange={(e) => onEndChange(e.target.value)}
        min={startValue || minDate}
        max={maxDate}
        placeholder={endPlaceholder}
        className="
          px-3 py-2.5 
          border border-gray-300 
          rounded 
          text-sm text-gray-900
          bg-white
          focus:outline-none focus:border-gray-400 focus:ring-0
          transition-colors
          hover:border-gray-400
          cursor-pointer
        "
        style={{ colorScheme: 'light', minWidth: '160px' }}
      />
    </div>
  );
};

/**
 * ✅ Minimal Single Date Input
 * 
 * The simplest version of a date field with no label or helper text.
 * Ideal for use in forms where labels are handled elsewhere.
 *
 * @param {Object} props - Component props.
 * @param {string} props.value - The selected date.
 * @param {Function} props.onChange - Called when the date changes.
 * @param {string} [props.minDate] - Minimum selectable date.
 * @param {string} [props.maxDate] - Maximum selectable date.
 * @param {string} [props.placeholder] - Placeholder text shown when no date is selected.
 * @param {boolean} [props.disabled=false] - Disables the input when true.
 * @param {string} [props.className] - Custom class names for extra styling.
 * @param {Object} [props.props] - Any additional props for the input element.
 */
export const DateInput = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={minDate}
      max={maxDate}
      disabled={disabled}
      placeholder={placeholder}
      className={`
        px-3 py-2.5 
        border border-gray-300 
        rounded 
        text-sm text-gray-900
        bg-white
        focus:outline-none focus:border-gray-400 focus:ring-0
        transition-colors
        hover:border-gray-400
        ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'cursor-pointer'}
        ${className}
      `}
      style={{ colorScheme: 'light', minWidth: '160px' }}
      {...props}
    />
  );
};

/** ✅ Default export: The main DatePicker component */
export default DatePicker;
