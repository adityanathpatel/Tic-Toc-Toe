# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions of **Tic-Tac-Toe Master**:

| Version | Supported          |
| :------ | :----------------- |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

We take the security of this project seriously. If you discover a security vulnerability, please follow responsible disclosure guidelines:

1. **Do not disclose publicly**: Please avoid opening public issues or discussions for potential security vulnerabilities.
2. **Submit a Private Report**: 
   - Report the vulnerability securely via [GitHub Security Advisories](https://github.com/adityanathpatel/Tic-Toc-Toe/security/advisories/new).
   - Alternatively, contact the repository maintainers through private GitHub communication channels.
3. **What to Include**:
   - Description of the vulnerability.
   - Steps or proof-of-concept to reproduce the issue.
   - Potential impact and suggested mitigation (if known).

---

## Response Timeline

- **Acknowledgment**: Within 48 hours of receiving the report.
- **Assessment & Triage**: Within 5 business days.
- **Fix & Disclosure**: A security patch will be prepared, tested, and released promptly, followed by coordinated public disclosure.

---

## Security Architecture

- **Client-Side Execution**: The game runs entirely client-side with zero external analytics, tracking, or telemetry.
- **Zero Remote Dependencies**: Web Audio API and 2D canvas particle rendering are implemented natively with zero external CDNs or untrusted runtime scripts.
- **Safe Storage**: Uses browser `localStorage` strictly for numerical game scores and non-sensitive UI preferences.
