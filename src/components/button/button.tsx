import { Fragment } from "react/jsx-runtime";
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
  iconPosition = "start",
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

  const contents = [icon, children].filter(Boolean);
  if (iconPosition === "end") {
    contents.reverse();
  }

  return (
    <button className={flattenedClassNames} {...restProps}>
      {contents.map((item, index) => (
        <Fragment key={index}>{item}</Fragment>
      ))}
    </button>
  );
};
