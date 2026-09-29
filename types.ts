export type Policy = {
  title: string;
  department: string;
  policy_text: string;
  category: string;
};

export type SearchResult = {
  answer: string;
  policy: Policy | null;
  score: number;
  supported: boolean;
};
