# Backend style guide

These preferences apply only to `backend/` and its descendants.

- Prefer braces around control-flow statement bodies, even when the body has
  only one statement.
- Avoid one-line control-flow statements and blocks. Put the body on separate
  lines for readability.

```ts
if (!user) {
  return;
}
```
