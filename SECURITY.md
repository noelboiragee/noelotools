# Security Policy

NoeloTools is a static website hosted on GitHub Pages from a public repository. These rules apply to every tool, page, script, stylesheet, and configuration change.

## Required security rules

1. **No secrets in the repository.** Never commit API keys, access tokens, passwords, private keys, or other credentials in HTML, CSS, JavaScript, JSON, or configuration files. Do not use realistic-looking secret placeholders.
2. **Browser-only processing.** Tools must run entirely in the user's browser without paid services or keyed APIs. If a feature genuinely requires a secret API credential, do not implement it in the static site. Explain the requirement first and propose a Cloudflare Worker backend proxy, keeping the credential in a Worker environment variable.
3. **Ignore sensitive/local files.** The root `.gitignore` must exclude `.env`, `.env.*`, `*.key`, `*.pem`, `secrets/`, and `node_modules/`.
4. **Environment examples only.** Never create or commit a real `.env` file. If configuration documentation is necessary, use `.env.example` with empty values only.
5. **Third-party dependencies.** Do not add third-party scripts, trackers, or CDN resources without explicit approval for each addition. When approved, use pinned versions rather than floating versions.
6. **Prevent XSS.** Treat all user-provided and externally sourced values as untrusted. Use safe DOM APIs such as `textContent` and `createElement` when rendering text. Do not interpolate untrusted values into `innerHTML`, executable code, or unsafe URLs.
7. **No user-data collection or transmission.** Do not collect, store, upload, or transmit user data. Tool processing must remain local to the browser. Do not add analytics, advertising trackers, telemetry, or remote logging.
8. **Required keyword scan.** Before completing each code task, scan the repository for: `sk-`, `api_key`, `apikey`, `token`, `secret`, `password`, and `Bearer`. Report matches and distinguish ordinary terms (for example, design tokens or a password-generator feature) from possible credentials. Investigate suspicious matches; never publish a suspected secret in a report.
9. **Conflict handling.** If a requested feature or change conflicts with these rules, stop before editing and explain the conflict. Do not silently weaken this policy.

## Static-site security boundary

GitHub Pages serves public static files. Anything placed in this repository or delivered to a browser must be treated as public and inspectable. Client-side obfuscation, hidden fields, comments, and environment-like placeholders do not protect credentials. A secret must never be shipped to the browser.

A Cloudflare Worker may be considered only when a feature needs a protected credential or server-side operation. Any such architecture requires explicit discussion and approval before implementation; credentials must remain in Worker environment variables and must never be returned to the client.

## Review checklist

Before each task is considered complete:

- Confirm no credentials or realistic secret placeholders were added.
- Confirm the tool's processing remains browser-local and does not send user data.
- Confirm no unapproved third-party scripts, trackers, or CDN resources were introduced.
- Review rendering of user-controlled values for DOM-based XSS risks.
- Run and report the required repository-wide keyword scan.
- Verify that `.gitignore` continues to exclude the required sensitive/local paths.

## Reporting a concern

If you find a suspected credential or security issue, do not copy the value into an issue, commit message, or public report. Identify the affected file and location without exposing the value, then remove the credential from the public repository and rotate/revoke it through its issuing provider.
