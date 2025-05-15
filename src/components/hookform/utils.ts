import type { FieldErrorsType } from "./types";

export function getErrorMessage(fieldErrors?: FieldErrorsType) {
  const errorMessage = fieldErrors || {};
  console.log("CTH: ", errorMessage);
  if (typeof errorMessage?.message === "string") return [errorMessage?.message];

  const messageList: string[] = [];
  Object.entries(errorMessage as FieldErrorsType).forEach(([_, value]) => {
    if (typeof value?.message === "string") {
      messageList.push(value?.message);
    } else {
      return getErrorMessage(value);
    }
  });

  return messageList;
}
