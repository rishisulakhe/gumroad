import { Switch } from "$app/components/Forms";
import { Label } from "$app/components/ui/Label";
import * as React from "react";

export const Toggle = ({
  value,
  onChange,
  id,
  disabled,
  children,
  ariaLabel,
}: {
  value: boolean;
  onChange?: ((newValue: boolean) => void) | undefined;
  id?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  ariaLabel?: string;
}) => (
  <Label>
    <Switch
      id={id}
      checked={value}
      onChange={(evt) => onChange?.(evt.target.checked)}
      disabled={disabled}
      aria-label={ariaLabel}
    />
    {children ? <span>{children}</span> : null}
  </Label>
);
