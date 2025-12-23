import * as React from "react";

import { classNames } from "$app/utils/classNames";

import { Icon } from "$app/components/Icons";

// =============================================================================
// SHARED STYLES
// =============================================================================

const inputBaseStyles = [
  "block w-full px-4 py-3 text-base",
  "border border-border rounded bg-filled text-foreground",
  "placeholder:text-muted",
  "focus:outline-2 focus:outline-accent",
  "disabled:cursor-not-allowed disabled:opacity-30",
  "read-only:bg-[var(--body-bg)]",
];

const disabledStyles = "cursor-not-allowed opacity-30";

// =============================================================================
// INPUT
// Text-like inputs: text, email, password, search, tel, url, number, date, time, datetime-local
// =============================================================================

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input ref={ref} className={classNames(inputBaseStyles, className)} {...props} />
));
Input.displayName = "Input";

// =============================================================================
// TEXTAREA
// =============================================================================

export interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={classNames(inputBaseStyles, "resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

// =============================================================================
// NATIVE SELECT
// For simple native selects. For complex selects, use the Select component from Select.tsx
// =============================================================================

export interface NativeSelectProps extends React.ComponentPropsWithoutRef<"select"> {}

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={classNames(
      inputBaseStyles,
      "appearance-none cursor-pointer",
      // Right padding for the arrow
      "pr-10",
      // Custom dropdown arrow - CSS handles this via background-image in SCSS
      // We keep the base styles and let SCSS handle the arrow for now
      className,
    )}
    {...props}
  />
));
NativeSelect.displayName = "NativeSelect";

// =============================================================================
// CHECKBOX
// Uses actual Icon element instead of ::after pseudo-element for the checkmark
// =============================================================================

export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, disabled, onChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    return (
      <span
        className={classNames(
          "relative inline-flex items-center justify-center",
          "size-[calc(1lh+2px)] shrink-0 text-base",
          "border border-border rounded-md cursor-pointer",
          isChecked ? "bg-accent" : "bg-filled",
          disabled && disabledStyles,
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          onChange={(e) => {
            if (!isControlled) setInternalChecked(e.target.checked);
            onChange?.(e);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
          {...props}
        />
        {isChecked && (
          <Icon name="outline-check" className="text-[color:var(--color)]" />
        )}
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";

// =============================================================================
// RADIO
// Uses actual span element instead of ::after pseudo-element for the dot
// =============================================================================

export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, checked, defaultChecked, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
    const controlledChecked = checked ?? isChecked;

    return (
      <span
        className={classNames(
          "relative inline-flex items-center justify-center",
          "size-[calc(1lh+2px)] shrink-0 text-base",
          "border border-border rounded-full cursor-pointer",
          controlledChecked ? "bg-accent" : "bg-filled",
          props.disabled && disabledStyles,
          className,
        )}
      >
        <input
          ref={ref}
          type="radio"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => {
            setIsChecked(e.target.checked);
            props.onChange?.(e);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
          {...props}
        />
        {controlledChecked && (
          <span className="size-2 rounded-full bg-[color:var(--color)]" />
        )}
      </span>
    );
  },
);
Radio.displayName = "Radio";

// =============================================================================
// SWITCH (Toggle)
// Uses actual span element instead of ::after pseudo-element for the toggle knob
// =============================================================================

export interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "role"> {
  children?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, children, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
    const controlledChecked = checked ?? isChecked;

    const switchTrack = (
      <span
        className={classNames(
          "relative inline-flex items-center shrink-0",
          "w-10 h-5 rounded-lg cursor-pointer",
          "border border-border transition-colors",
          controlledChecked ? "bg-accent" : "bg-filled",
          props.disabled && disabledStyles,
          className,
        )}
      >
        <Switch
          ref={ref}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => {
            setIsChecked(e.target.checked);
            props.onChange?.(e);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
          {...props}
        />
        {/* Toggle knob */}
        <span
          className={classNames(
            "absolute size-4 rounded-lg transition-all",
            controlledChecked
              ? "left-[calc(100%-1.125rem)] bg-[color:var(--contrast-accent)]"
              : "left-0.5 bg-current",
          )}
        />
      </span>
    );

    if (children) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {switchTrack}
          <span>{children}</span>
        </label>
      );
    }

    return switchTrack;
  },
);
Switch.displayName = "Switch";

// =============================================================================
// INPUT GROUP
// Wrapper for composite inputs with icons, prefixes, or suffixes
// Replaces the .input CSS class
// =============================================================================

export interface InputGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  disabled?: boolean;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, disabled, children, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames(
        "inline-flex items-center gap-2 relative w-full",
        "px-4 min-h-10",
        "border border-border rounded bg-filled text-base",
        "focus-within:outline-2 focus-within:outline-accent",
        // Nested input styling - remove its border/background
        "[&>input]:border-0 [&>input]:bg-transparent [&>input]:outline-none [&>input]:flex-1 [&>input]:p-0 [&>input]:min-w-0",
        "[&>select]:border-0 [&>select]:bg-transparent [&>select]:outline-none [&>select]:flex-1 [&>select]:p-0",
        "[&>.icon]:text-muted",
        disabled && disabledStyles,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
InputGroup.displayName = "InputGroup";

// =============================================================================
// LABEL
// =============================================================================

export interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={classNames(
      "inline-flex gap-2 text-base cursor-pointer",
      "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-30",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

// =============================================================================
// FIELDSET
// =============================================================================

export interface FieldsetProps extends React.ComponentPropsWithoutRef<"fieldset"> {
  /** Validation state */
  state?: "danger" | "success" | "warning";
}

export const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ className, state, ...props }, ref) => (
    <fieldset
      ref={ref}
      className={classNames(
        "flex flex-col gap-2 border-0",
        // State-based border colors on inputs
        state === "danger" && "[&_input]:border-danger [&_select]:border-danger [&_textarea]:border-danger",
        state === "success" && "[&_input]:border-success [&_select]:border-success [&_textarea]:border-success",
        state === "warning" && "[&_input]:border-warning [&_select]:border-warning [&_textarea]:border-warning",
        // State-based text colors on small/helper text
        state === "danger" && "[&>small]:text-danger",
        state === "success" && "[&>small]:text-success",
        state === "warning" && "[&>small]:text-warning",
        className,
      )}
      {...props}
    />
  ),
);
Fieldset.displayName = "Fieldset";

// =============================================================================
// LEGEND
// =============================================================================

export interface LegendProps extends React.ComponentPropsWithoutRef<"legend"> {}

export const Legend = React.forwardRef<HTMLLegendElement, LegendProps>(({ className, ...props }, ref) => (
  <legend
    ref={ref}
    className={classNames(
      "flex items-center relative font-bold mb-2 w-full text-base",
      "[&>label]:font-normal [&>a]:font-normal",
      "[&>:last-child:not(:only-child)]:ml-auto",
      className,
    )}
    {...props}
  />
));
Legend.displayName = "Legend";

// =============================================================================
// FORM SECTION
// Responsive two-column form layout
// =============================================================================

export interface FormSectionProps extends React.ComponentPropsWithoutRef<"section"> {}

export const FormSection = React.forwardRef<HTMLElement, FormSectionProps>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={classNames(
      "grid gap-6 py-7 border-t border-border",
      "first-of-type:pt-0 first-of-type:border-t-0",
      // Large screen: two-column layout
      "lg:gap-x-8 lg:gap-y-0 lg:grid-cols-[25%_1fr]",
      "lg:[&>*]:mb-6 lg:[&>*]:col-start-2",
      "lg:[&>header]:col-start-1 lg:[&>header]:row-[1/10]",
      className,
    )}
    {...props}
  />
));
FormSection.displayName = "FormSection";

// =============================================================================
// FORM SECTION HEADER
// =============================================================================

export interface FormSectionHeaderProps extends React.ComponentPropsWithoutRef<"header"> {}

export const FormSectionHeader = React.forwardRef<HTMLElement, FormSectionHeaderProps>(
  ({ className, ...props }, ref) => (
    <header ref={ref} className={classNames("grid gap-3 content-start", className)} {...props} />
  ),
);
FormSectionHeader.displayName = "FormSectionHeader";

// =============================================================================
// FORM HELPER TEXT
// Small text below inputs for hints or errors
// =============================================================================

export interface FormHelperTextProps extends React.ComponentPropsWithoutRef<"small"> {}

export const FormHelperText = React.forwardRef<HTMLElement, FormHelperTextProps>(({ className, ...props }, ref) => (
  <small ref={ref} className={classNames("text-muted", className)} {...props} />
));
FormHelperText.displayName = "FormHelperText";

// =============================================================================
// COLOR PICKER
// =============================================================================

export interface ColorPickerProps extends Omit<React.ComponentPropsWithoutRef<"input">, "type"> {}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(({ className, ...props }, ref) => (
  <div className="relative overflow-hidden p-4 border border-border rounded-lg max-w-fit">
    <input
      ref={ref}
      type="color"
      className={classNames(
        "absolute w-[200%] h-[200%] max-w-none -left-1/2 -top-1/2 border-0 cursor-pointer",
        className,
      )}
      {...props}
    />
  </div>
));
ColorPicker.displayName = "ColorPicker";

// =============================================================================
// RADIO GROUP
// Button-style radio group (role="radiogroup")
// =============================================================================

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<"div"> {}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="radiogroup"
    className={classNames(
      "radio-buttons grid gap-4",
      "grid-cols-[repeat(auto-fit,minmax(min(15rem,100%),1fr))]",
      className,
    )}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

// =============================================================================
// RADIO GROUP BUTTON
// Individual button within a RadioGroup
// =============================================================================

export interface RadioGroupButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  checked?: boolean;
}

export const RadioGroupButton = React.forwardRef<HTMLButtonElement, RadioGroupButtonProps>(
  ({ className, checked, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      className={classNames(
        "border border-border rounded p-4 cursor-pointer text-left transition-colors",
        checked && "bg-accent text-accent-foreground border-accent",
        className,
      )}
      {...props}
    />
  ),
);
RadioGroupButton.displayName = "RadioGroupButton";
