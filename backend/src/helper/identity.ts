import { caseFold } from "unicode-case-folding";

export const trimUnicodeWhitespace = (value: string): string => value.replace(/^\p{White_Space}+|\p{White_Space}+$/gu, "");

export const codePointLength = (value: string): number => [...value].length;

export const usernameKey = (value: string): string => trimUnicodeWhitespace(value).replace(/[A-Z]/g, (letter) => letter.toLowerCase());

export const emailKey = (value: string): string => caseFold(trimUnicodeWhitespace(value));

export const artistNameKey = (value: string): string => caseFold(trimUnicodeWhitespace(value));
