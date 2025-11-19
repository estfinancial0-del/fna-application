import { NumericFormat, PatternFormat } from "react-number-format";
import { Input } from "./input";
import { forwardRef } from "react";

interface CurrencyInputProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, placeholder = "$0.00", className, disabled }, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        value={value}
        onValueChange={(values) => {
          onValueChange?.(values.floatValue);
        }}
        thousandSeparator=","
        prefix="$"
        placeholder={placeholder}
        customInput={Input}
        className={className}
        disabled={disabled}
        allowNegative={false}
        decimalScale={2}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

interface PercentageInputProps {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>(
  ({ value, onValueChange, placeholder = "0%", className, disabled }, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        value={value}
        onValueChange={(values) => {
          onValueChange?.(values.floatValue);
        }}
        suffix="%"
        placeholder={placeholder}
        customInput={Input}
        className={className}
        disabled={disabled}
        allowNegative={false}
        decimalScale={2}
        isAllowed={(values) => {
          const { floatValue } = values;
          return floatValue === undefined || floatValue <= 100;
        }}
      />
    );
  }
);

PercentageInput.displayName = "PercentageInput";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder = "(04) 1234 5678", className, disabled }, ref) => {
    return (
      <PatternFormat
        getInputRef={ref}
        value={value}
        onValueChange={(values) => {
          onChange?.(values.value);
        }}
        format="(##) #### ####"
        mask="_"
        placeholder={placeholder}
        customInput={Input}
        className={className}
        disabled={disabled}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

interface ABNInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const ABNInput = forwardRef<HTMLInputElement, ABNInputProps>(
  ({ value, onChange, placeholder = "12 345 678 901", className, disabled }, ref) => {
    return (
      <PatternFormat
        getInputRef={ref}
        value={value}
        onValueChange={(values) => {
          onChange?.(values.value);
        }}
        format="## ### ### ###"
        mask="_"
        placeholder={placeholder}
        customInput={Input}
        className={className}
        disabled={disabled}
      />
    );
  }
);

ABNInput.displayName = "ABNInput";

interface PostcodeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PostcodeInput = forwardRef<HTMLInputElement, PostcodeInputProps>(
  ({ value, onChange, placeholder = "2000", className, disabled }, ref) => {
    return (
      <PatternFormat
        getInputRef={ref}
        value={value}
        onValueChange={(values) => {
          onChange?.(values.value);
        }}
        format="####"
        mask="_"
        placeholder={placeholder}
        customInput={Input}
        className={className}
        disabled={disabled}
      />
    );
  }
);

PostcodeInput.displayName = "PostcodeInput";
