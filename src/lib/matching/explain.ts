import type { DemoUser } from '@/data/demo-users';
import type { Gathering } from '@/data/gatherings';
import { findSimilarAttendees, tokenize } from './engine';
import { topics } from '@/data/topics';

export interface RecommendationReason {
  key: 'matching-interest' | 'intimate-size' | 'similar-attendees' | 'topic';
  interest?: string;
  count?: number;
  topicSlug?: string;
}

export function explainRecommendation(user: DemoUser, gathering: Gathering, _score: number): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  const topic = topics.find((t) => t.slug === gathering.topicSlug);
  if (topic) {
    const kw = [gathering.topicSlug, ...tokenize(topic.name.ar), ...tokenize(topic.name.en)];
    const mi = user.interests.find((i) => kw.some((k) => k === i || k.includes(i.toLowerCase()) || i.toLowerCase().includes(k)));
    if (mi) reasons.push({ key: 'matching-interest', interest: mi });
  }
  if (gathering.capacityMax <= 20) reasons.push({ key: 'intimate-size' });
  const sim = findSimilarAttendees(user, gathering.slug, 5);
  if (sim.length > 0) reasons.push({ key: 'similar-attendees', count: sim.length });
  if (topic) reasons.push({ key: 'topic', topicSlug: topic.slug });
  return reasons.slice(0, 3);
}
