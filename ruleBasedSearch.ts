import { Policy, SearchResult } from "./types";

const STOPWORDS = new Set([
  "the","a","an","and","or","to","of","in","on","for","with","is","are","am",
  "be","can","could","should","would","do","does","did","i","we","you","they",
  "employees","employee","company","our","my","how","what","when","where","who",
  "which","many","much","get","have","has","had","about","from","at","as"
]);

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => {
      if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
      if (word.endsWith("s") && word.length > 4) return word.slice(0, -1);
      return word;
    })
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function overlapScore(queryWords: string[], targetWords: string[], weight: number) {
  const target = new Set(targetWords);
  return queryWords.reduce((score, word) => score + (target.has(word) ? weight : 0), 0);
}

export function ruleBasedSearch(question: string, policies: Policy[]): SearchResult {
  const queryWords = normalize(question);

  let bestPolicy: Policy | null = null;
  let bestScore = 0;

  for (const policy of policies) {
    const titleWords = normalize(policy.title);
    const categoryWords = normalize(policy.category);
    const departmentWords = normalize(policy.department);
    const policyWords = normalize(policy.policy_text);

    let score = 0;
    score += overlapScore(queryWords, titleWords, 5);
    score += overlapScore(queryWords, categoryWords, 3);
    score += overlapScore(queryWords, policyWords, 2);
    score += overlapScore(queryWords, departmentWords, 1);

    if (score > bestScore) {
      bestScore = score;
      bestPolicy = policy;
    }
  }

  const threshold = 4;

  if (!bestPolicy || bestScore < threshold) {
    return {
      answer: "No relevant policy found.",
      policy: null,
      score: bestScore,
      supported: false,
    };
  }

  return {
    answer: bestPolicy.policy_text,
    policy: bestPolicy,
    score: bestScore,
    supported: true,
  };
}
