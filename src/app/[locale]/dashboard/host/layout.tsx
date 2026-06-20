import { HostGuard } from '@/components/lamma/auth/HostGuard';
import { HostSidebar } from '@/components/lamma/host/HostSidebar';
import { Container } from '@/components/lamma/Container';
export default function HostLayout({ children }: { children: React.ReactNode }) {
  return <HostGuard><Container className="py-8"><div className="grid gap-8 lg:grid-cols-[260px_1fr]"><HostSidebar /><main>{children}</main></div></Container></HostGuard>;
}
