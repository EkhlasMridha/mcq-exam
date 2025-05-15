import { EyeIcon, EyeSlashIcon } from "components/icons";
import type { InputProps } from "components/input/types";
import { useState } from "react";

interface PasswordInputProps extends Omit<InputProps, "type"> {}

export const PasswordInput = ({
  isError,
  variantSize,
  className,
  ...restProps
}: PasswordInputProps) => {
  let classNames = ["mq-input-outline", "password-input", className];
  isError && classNames.unshift("error");

  const [showPassword, setShowPassword] = useState(false);

  const onTogglePasswordVisibility = () => {
    setShowPassword((pre) => !pre);
  };
  return (
    <div className={classNames.join(" ")} aria-describedby="password">
      <input
        className={`mq-input-${variantSize} mq-input w-full`}
        {...restProps}
        type={showPassword ? "text" : "password"}
      />
      <div
        role="button"
        aria-label="password-visiblity"
        className="eye-icon-container"
        onClick={onTogglePasswordVisibility}
      >
        {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
      </div>
    </div>
  );
};
