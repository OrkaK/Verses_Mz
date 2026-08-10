/**
  SuperMemo-2 (SM-2) Spaced Repetition Algorithm implementation.
  Rating scale:
  1 = Again (Failed recall)
  2 = Hard (Difficult recall)
  3 = Good (Successful recall with some effort)
  4 = Easy (Perfect, instant recall)
 */

export function calculateSRS(grade, currentInterval = 0, currentEaseFactor = 2.5, timesReviewed = 0) {
  let nextInterval = 0;
  let easeFactor = currentEaseFactor;

  // Grade must be 1 to 4
  const q = Math.max(1, Math.min(4, grade));

  // Calculate new Ease Factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // Adapted scale mapping q (1..4) to standard SM-2 5-point scale
  const sm2Score = q + 1; // 1->2, 2->3, 3->4, 4->5
  easeFactor = easeFactor + (0.1 - (5 - sm2Score) * (0.08 + (5 - sm2Score) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  if (q < 2) {
    // Failed recall (Again)
    nextInterval = 1;
  } else {
    // Successful recall
    if (timesReviewed === 0) {
      nextInterval = 1;
    } else if (timesReviewed === 1) {
      nextInterval = 3;
    } else {
      nextInterval = Math.round(currentInterval * easeFactor);
    }
  }

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextInterval);

  // Mastery state determination
  let mastery = 'Learning';
  if (nextInterval >= 10) {
    mastery = 'Mastered';
  } else if (nextInterval >= 3) {
    mastery = 'Reviewing';
  }

  return {
    srsInterval: nextInterval,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    nextReviewDate: nextDate.toISOString(),
    timesReviewed: timesReviewed + 1,
    mastery
  };
}
