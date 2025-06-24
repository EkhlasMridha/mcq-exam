import type { CSSProperties } from "react";

interface SelectPlaceHolderProps {
  placeHolder?: string;
  style?: CSSProperties;
}

export const SelectPlaceHolder = ({
  placeHolder,
  style,
}: SelectPlaceHolderProps) => {
  return (
    <span className="select-placeholder" style={style}>
      {placeHolder}
    </span>
  );
};
