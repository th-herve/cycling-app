const Classification = {
  FLAT: "flat",
  TT: "tt",
  TTT: "ttt",
  PROLOGUE: "prologue",
  HILLY: "hilly",
  MEDIUM_MOUNTAIN: "medium_mountain",
  HIGH_MOUNTAIN: "high_mountain",
} as const;

type Classification = (typeof Classification)[keyof typeof Classification];

export const classificationLabels: Record<Classification, string> = {
  flat: "Flat",
  tt: "Time trial",
  ttt: "Team time trial",
  prologue: "Prologue",
  hilly: "Hilly",
  medium_mountain: "Medium mountain",
  high_mountain: "High mountain",
};

export default Classification;
