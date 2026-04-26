export function nextStreakDays(lastActiveAt: string, currentStreak: number, now: Date) {
  if (currentStreak <= 0) {
    return 1;
  }

  const last = new Date(lastActiveAt);

  if (Number.isNaN(last.getTime())) {
    return 1;
  }

  const lastDay = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate());
  const currentDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayDelta = Math.floor((currentDay - lastDay) / 86_400_000);

  if (dayDelta <= 0) {
    return currentStreak;
  }

  if (dayDelta === 1) {
    return currentStreak + 1;
  }

  return 1;
}

export function streakRewardEP(streakDays: number) {
  return streakDays >= 1 ? 100 : 0;
}
