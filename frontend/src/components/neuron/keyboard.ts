export const shouldHandleKeyboardEvent = (
  keyEvent?: KeyboardEvent,
  ignoredKeyEvent?: KeyboardEvent,
): keyEvent is KeyboardEvent =>
  keyEvent !== undefined && keyEvent !== ignoredKeyEvent;
