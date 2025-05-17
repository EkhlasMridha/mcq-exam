import type { ButtonProps } from "./types";

export const Button = ({
  color = "primary",
  size = "medium",
  variant = "solid",
  shape = "rounded",
  children,
  icon,
  loading,
  className,
  ...restProps
}: ButtonProps) => {
  const classNames = [
    "mq-btn",
    `mq-btn-${size}`,
    `mq-btn-${color}`,
    `mq-btn-${variant}`,
    `mq-btn-${shape}`,
    className,
  ];
  !!icon && classNames.unshift("mq-btn-icon");
  const flattenedClassNames = classNames.join(" ").trim();

  return (
    <button className={flattenedClassNames} {...restProps}>
      {icon}
      {children}
    </button>
  );
};
