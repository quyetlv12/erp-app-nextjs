"use client";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

interface Option {
  label: string;
  value: string | number;
}

interface InputFieldProps {
  name: string;
  label?: string;
  type?:
    | "text"
    | "email"
    | "number"
    | "password"
    | "date"
    | "select"
    | "textarea"
    | "currency"
    | "tel"
    | "file";
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  height?: "sm" | "default";
  accept?: string;
  multiple?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder = "",
  options = [],
  disabled = false,
  required = false,
  rows = 3,
  suffix,
  prefix,
  className = "",
  icon,
  iconPosition = "left",
  height = "default",
  accept,
  multiple,
}) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = React.useState(false);

  const baseInputClass = [
    "w-full",
    "rounded-lg",
    "border-[1.5px]",
    "border-stroke",
    "bg-transparent",
    "outline-none",
    "transition",
    "focus:border-primary",
    "disabled:cursor-default",
    "disabled:bg-gray-2",
    "data-[active=true]:border-primary",
    "dark:border-dark-3",
    "dark:bg-dark-2",
    "dark:focus:border-primary",
    "dark:disabled:bg-dark",
    "dark:data-[active=true]:border-primary",
    "px-2 py-3",
    "text-dark",
    "placeholder:text-dark-6",
    "dark:text-white",
    "dark:placeholder:text-dark-4",
  ].join(" ");

  const fileInputClass = [
    baseInputClass,
    "file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-primary file:hover:bg-opacity-10",
    "dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white",
  ].join(" ");

  const labelClass = "text-body-sm font-medium text-dark dark:text-white";
  const errorClass =
    "border-red-500 focus:border-red-500 focus:ring-red-500 ring-1 ring-red-400 dark:border-red-500 dark:focus:border-red-500 dark:ring-red-400";

  const InputWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <div
      className={[
        "relative mt-3 flex items-center",
        iconPosition === "left"
          ? "[&_svg]:absolute [&_svg]:left-4.5 [&_svg]:top-1/2 [&_svg]:-translate-y-1/2"
          : "[&_svg]:absolute [&_svg]:right-4.5 [&_svg]:top-1/2 [&_svg]:-translate-y-1/2",
      ].join(" ")}
    >
      {iconPosition === "left" && icon}
      {prefix && (
        <span className="pointer-events-none absolute left-3 text-base text-gray-400 dark:text-dark-4">
          {prefix}
        </span>
      )}
      {children}
      {suffix && (
        <span className="pointer-events-none absolute right-3 text-base text-gray-400 dark:text-dark-4">
          {suffix}
        </span>
      )}
      {iconPosition === "right" && icon}
    </div>
  );

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className={labelClass}>
          {label}
          {required && (
            <span className="ml-1 select-none text-red dark:text-red-400">
              *
            </span>
          )}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const error = fieldState?.error?.message;

          const inputClass = [
            baseInputClass,
            error ? errorClass : "",
            prefix ? "pl-9" : "",
            suffix ? "pr-9" : "",
          ].join(" ");

          if (type === "textarea") {
            return (
              <>
                <textarea
                  {...field}
                  id={name}
                  rows={rows}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={[inputClass, "min-h-[44px] resize-none"].join(" ")}
                  style={{
                    paddingLeft: prefix ? 36 : undefined,
                    paddingRight: suffix ? 36 : undefined,
                  }}
                />
                {error && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
              </>
            );
          }

          if (type === "select") {
            return (
              <>
                <div className="relative mt-3">
                  <select
                    {...field}
                    id={name}
                    disabled={disabled}
                    className={[inputClass, "appearance-none pr-10"].join(" ")}
                  >
                    <option value="" className="dark:bg-dark-2 dark:text-white">
                      -- Chọn --
                    </option>
                    {options.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="dark:bg-dark-2 dark:text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-4">
                    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                      <path
                        d="M6 8l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                {error && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
              </>
            );
          }

          if (type === "currency") {
            return (
              <>
                <InputWrapper>
                  <NumericFormat
                    {...field}
                    id={name}
                    thousandSeparator=","
                    decimalSeparator="."
                    allowNegative={false}
                    placeholder={placeholder}
                    disabled={disabled}
                    prefix={prefix}
                    suffix={suffix}
                    className={inputClass}
                    onValueChange={(values: any) => {
                      field.onChange(values.value);
                    }}
                  />
                </InputWrapper>
                {error && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
              </>
            );
          }

          if (type === "file") {
            return (
              <>
                <div className="relative mt-3">
                  <input
                    id={name}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    className={fileInputClass + (error ? ` ${errorClass}` : "")}
                    onChange={(e) => {
                      field.onChange(e.target.files);
                    }}
                  />
                </div>
                {error && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
              </>
            );
          }

          if (type === "password") {
            return (
              <>
                <div className="relative mt-3">
                  <input
                    {...field}
                    id={name}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={[inputClass, "pr-10"].join(" ")}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-4"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
              </>
            );
          }

          return (
            <>
              <InputWrapper>
                <input
                  {...field}
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={inputClass}
                  autoComplete="off"
                />
              </InputWrapper>
              {error && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default InputField;
