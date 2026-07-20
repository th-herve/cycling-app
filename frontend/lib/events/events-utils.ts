import Event from "@/types/event";

/*
 * Given a list of stages for one event,
 * returns the last stage with results.
 * If none are found, returns undefined.
 *
 * Assumes the stages list is in order.
 */
export const getLastStageWithResults = (stages: Event[]) => {
  if (stages.length === 0) {
    return undefined;
  }

  for (let i = stages.length - 1; i >= 0; i--) {
    if (hasResult(stages[i])) {
      return stages[i];
    }
  }

  return undefined;
};

export const hasResult = (event: Event) =>
  !!event.results && Object.keys(event.results).length > 0;
