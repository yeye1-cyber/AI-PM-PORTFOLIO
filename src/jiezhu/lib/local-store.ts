"use client";

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(`jiezhu:${key}`);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(`jiezhu:${key}`, JSON.stringify(value));
  }
}
