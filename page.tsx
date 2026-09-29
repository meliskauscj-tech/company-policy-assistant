"use client";

import { FormEvent, useState } from "react";

type ApiResponse = {
  approach: string;
  answer: string;
  policy: {
    title: string;
    department: string;
    policy_text: string;
    category: string;
  } | null;
  score: number;
  supported: boolean;
  responseTimeMs: number;
  tokensUsed: number;
  error?: string;
};

const examples = [
  "How many vacation days do employees get?",
  "Can employees work remotely?",
  "Does the company pay for gym memberships?",
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/rule-based", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">AI & ACCOUNTING · POLICY RETRIEVAL</div>
        <h1>Company Policy Assistant</h1>
        <p className="subtitle">
          Ask a company policy question and see how a rules-based search system
          identifies the most relevant policy.
        </p>

        <form onSubmit={handleSubmit} className="search-card">
          <label htmlFor="question">Policy question</label>
          <div className="search-row">
            <input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How many vacation days do employees get?"
            />
            <button disabled={loading || !question.trim()}>
              {loading ? "Searching…" : "Search policies"}
            </button>
          </div>
          <div className="examples">
            {examples.map((example) => (
              <button
                type="button"
                className="example-chip"
                key={example}
                onClick={() => setQuestion(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </form>
      </section>

      <section className="comparison-header">
        <div>
          <span className="step-badge">Approach 1 of 3</span>
          <h2>Rules-Based Search</h2>
        </div>
        <p>
          Deterministic keyword matching across policy title, category,
          department and policy text. No LLM is used.
        </p>
      </section>

      {error && <div className="error-card">{error}</div>}

      {!result && !error && (
        <section className="empty-state">
          <div className="empty-icon">⌕</div>
          <h3>No search yet</h3>
          <p>Enter a policy question above to test the rules-based approach.</p>
        </section>
      )}

      {result && (
        <section className="result-grid">
          <article className="answer-card">
            <div className="card-topline">
              <span>Answer</span>
              <span className={result.supported ? "status supported" : "status unsupported"}>
                {result.supported ? "Policy found" : "No policy found"}
              </span>
            </div>
            <h3>{result.answer}</h3>

            {result.policy && (
              <div className="policy-box">
                <div className="policy-title">{result.policy.title}</div>
                <div className="policy-meta">
                  <span>{result.policy.category}</span>
                  <span>·</span>
                  <span>{result.policy.department}</span>
                </div>
              </div>
            )}
          </article>

          <aside className="metrics-card">
            <div className="metric">
              <span>Response time</span>
              <strong>{result.responseTimeMs} ms</strong>
            </div>
            <div className="metric">
              <span>Tokens used</span>
              <strong>{result.tokensUsed}</strong>
            </div>
            <div className="metric">
              <span>Match score</span>
              <strong>{result.score}</strong>
            </div>
            <div className="metric">
              <span>Unsupported answer</span>
              <strong>{result.supported ? "No" : "No answer returned"}</strong>
            </div>
          </aside>
        </section>
      )}

      <section className="method-card">
        <div>
          <span className="method-label">How it works</span>
          <h3>Transparent weighted matching</h3>
        </div>
        <div className="weights">
          <div><strong>+5</strong><span>Title match</span></div>
          <div><strong>+3</strong><span>Category match</span></div>
          <div><strong>+2</strong><span>Policy text match</span></div>
          <div><strong>+1</strong><span>Department match</span></div>
        </div>
      </section>
    </main>
  );
}
