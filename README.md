# Company Policy Assistant

University assignment prototype for comparing policy retrieval approaches.

## Current status

This repository currently contains **Approach 1: Rules-Based Search**.

The system:
- reads the provided company policy CSV file,
- normalizes the user's question,
- scores each policy using deterministic weighted keyword matching,
- returns the highest-scoring policy if the score passes a minimum threshold,
- reports response time, token usage, match score, and whether an unsupported answer was produced.

### Weighting

- Title match: +5
- Category match: +3
- Policy text match: +2
- Department match: +1

The rules-based approach uses **0 LLM tokens**.

## Run locally

```bash
npm install
npm run dev
```

Then open:

`http://localhost:3000`

## Planned next steps

- Approach 2: LLM without vector index
- Approach 3: LLM with vector index
- Side-by-side comparison
- Final two-paragraph evaluation
