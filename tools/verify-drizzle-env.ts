#!/usr/bin/env tsx
import process from "node:process";

const variableName = "DATABASE_URL";

const value = process.env[variableName];

if (!value || value.trim() === "") {
  console.error(
    `Brak zmiennej środowiskowej ${variableName}. Uzupełnij ją w .env.local (np. postgres://devuser:devpass@localhost:5432/jkdb), aby Drizzle mógł połączyć się z bazą.`
  );
  process.exit(1);
}

console.log(
  `✓ Zmienna ${variableName} jest ustawiona. Drizzle może korzystać z połączenia do bazy danych.`
);
