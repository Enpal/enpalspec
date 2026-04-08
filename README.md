Start with `/enpalspec:explore "your idea"` to think it through, then `/enpalspec:propose` to generate all artifacts.

## See it in action

```text
You: /enpalspec:explore add-dark-mode
AI:  Let's think this through...
     What's the goal? Where does theming live today?
     Key decision: CSS variables vs. Tailwind dark mode?
     → Recommendation: CSS variables, stored in localStorage

You: /enpalspec:propose add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /enpalspec:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /enpalspec:archive
AI:  Archived to openspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```


## Quick Start

**Requires Node.js 20.19.0 or higher.**

Install EnpalSpec globally:

```bash
npm install -g @enpal/enpalspec@latest
```

Then navigate to your project directory and initialize:

```bash
cd your-project
enpalspec init
```

Now tell your AI: `/enpalspec:explore <what-you-want-to-build>` to think it through, then `/enpalspec:propose` to generate all artifacts.

## Why EnpalSpec?

AI coding assistants are powerful but unpredictable when requirements live only in chat history. EnpalSpec adds a lightweight spec layer so you agree on what to build before any code is written.

- **Agree before you build** — human and AI align on specs before code gets written
- **Stay organized** — each change gets its own folder with proposal, specs, design, and tasks
- **Work fluidly** — update any artifact anytime, no rigid phase gates
- **Use your tools** — works with 20+ AI assistants via slash commands

## Updating EnpalSpec

**Upgrade the package**

```bash
npm install -g @enpal/enpalspec@latest
```

**Refresh agent instructions**

Run this inside each project to regenerate AI guidance and ensure the latest slash commands are active:

```bash
enpalspec update
```

## Built on OpenSpec

EnpalSpec is a fork of [OpenSpec](https://github.com/Fission-AI/OpenSpec) by Fission AI. Thanks to the OpenSpec team for the foundation.

## License

MIT
