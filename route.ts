import { NextResponse } from "next/server";
import { loadPolicies } from "@/lib/loadPolicies";
import { ruleBasedSearch } from "@/lib/ruleBasedSearch";

export async function POST(request: Request) {
  const start = performance.now();

  try {
    const body = await request.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";

    if (!question) {
      return NextResponse.json(
        { error: "Please enter a policy question." },
        { status: 400 }
      );
    }

    const policies = loadPolicies();
    const result = ruleBasedSearch(question, policies);
    const end = performance.now();

    return NextResponse.json({
      approach: "Rules-based search",
      ...result,
      responseTimeMs: Number((end - start).toFixed(2)),
      tokensUsed: 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while searching the policy database." },
      { status: 500 }
    );
  }
}
