import { EyeIcon, EyeSlashIcon } from "components/icons";
import type { InputProps } from "components/input/types";
import { useRef, useState, type KeyboardEvent } from "react";

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
  const eyeRef = useRef<HTMLDivElement>(null);

  const onTogglePasswordVisibility = () => {
    setShowPassword((pre) => !pre);
  };
  const handleEyeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    (event.key === "Enter" || event.key === " ") && eyeRef.current?.click();
  };
  return (
    <div className={classNames.join(" ")} aria-describedby="password">
      <input
        className={`mq-input-${variantSize} mq-input w-full`}
        {...restProps}
        type={showPassword ? "text" : "password"}
      />
      <div
        ref={eyeRef}
        role="button"
        aria-label="password-visiblity"
        className="eye-icon-container"
        onClick={onTogglePasswordVisibility}
        tabIndex={0}
        onKeyDown={handleEyeKeyDown}
      >
        {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
      </div>
    </div>
  );
};
