import * as React from "react";

import { classNames } from "$app/utils/classNames";

export interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {
  disabled?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, disabled, ...props }, ref) => (
    <label
      ref={ref}
      className={classNames(
        "inline-flex gap-2 text-base cursor-pointer",
        disabled && "cursor-not-allowed opacity-30",
        className,
      )}
      {...props}
    />
  ),
);

Label.displayName = "Label";
