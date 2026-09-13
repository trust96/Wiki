export const getRequiredInputMessage = (fieldLabel?: string) => {
  const message = `${fieldLabel ?? "Questo campo"} e' obbligatorio!`;
  return message;
};
