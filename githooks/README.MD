# Git Hooks

## Installation

To install either of these hooks, run `cp githooks/pre-commit .git/hooks && chmod +x .git/hooks/pre-commit` from the
root of the project. Make sure to include the correct file name ("pre-commit" or "pre-push").

Use of the pre-push hook is discouraged. Once files are committed, the change set is obfuscated and additional commits
are required to enable a push. Suggest use of pre-commit hook instead.
