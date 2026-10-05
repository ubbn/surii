/// <reference types="jest" />

import { shouldHandleKeyboardEvent } from "./keyboard";

describe("shouldHandleKeyboardEvent", () => {
  test("ignores a keyboard event that was already current when the page mounted", () => {
    const event = new KeyboardEvent("keydown", { key: "c" });

    expect(shouldHandleKeyboardEvent(event, event)).toBe(false);
  });

  test("handles a new keyboard event after the page has mounted", () => {
    const previousEvent = new KeyboardEvent("keydown", { key: "c" });
    const nextEvent = new KeyboardEvent("keydown", { key: "c" });

    expect(shouldHandleKeyboardEvent(nextEvent, previousEvent)).toBe(true);
  });
});
