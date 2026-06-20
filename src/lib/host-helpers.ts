import { hosts } from '@/data/hosts';
import { gatherings } from '@/data/gatherings';

export function getUserHost(userId: string) { return hosts.find((h) => h.userId === userId); }
export function isUserHost(userId: string): boolean { return !!getUserHost(userId); }
export function getHostGatherings(hostHandle: string) { return gatherings.filter((g) => g.hostHandle === hostHandle); }
export function getHostUpcomingGatherings(hostHandle: string) {
  const now = Date.now();
  return getHostGatherings(hostHandle).filter((g) => new Date(g.startDate).getTime() > now && g.status !== 'CANCELLED');
}
export function getHostPastGatherings(hostHandle: string) {
  const now = Date.now();
  return getHostGatherings(hostHandle).filter((g) => new Date(g.startDate).getTime() <= now);
}
