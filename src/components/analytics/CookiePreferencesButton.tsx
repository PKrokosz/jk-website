"use client";

import React from "react";

interface CookiePreferencesButtonProps {
  onClick(): void;
}

export function CookiePreferencesButton({ onClick }: CookiePreferencesButtonProps) {
  return (
    <button className="cookie-preferences" onClick={onClick} type="button">
      Ustawienia prywatności
    </button>
  );
}
