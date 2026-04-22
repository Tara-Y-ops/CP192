# AGENTS.md

Guidance for human and AI contributors working in this repository.

## Git commit rules

- After completing a feature, small functionality, test change, or bug fix, and after the necessary validation passes, default to running `git commit` to the current remote branch.
- Continue using the repository's Conventional Commit format for commit messages (for example `feat:`, `fix:`, `test:`, `chore:`, `pref:`).
- If there are unrelated dirty changes in the working tree, default to committing only the files changed for the current task instead of asking for confirmation. YOU MUST COMMIT AFTER YOU WORK.

## Build and test rules

- Run the full build flow after making changes.
- Every run must include testing or equivalent validation before finishing the task.
- If the repository does not provide a dedicated `test` script, run all available validation commands instead, with `lint` and `build` as the minimum baseline when those scripts exist.
