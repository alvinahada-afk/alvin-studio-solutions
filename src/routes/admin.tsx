import { createFileRoute } from '@tanstack/react-router';
import { AdminDashboard } from '@/components/studio/admin-dashboard';

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [
    { title: 'Alvin Studio — Control Center' },
    { name: 'robots', content: 'noindex,nofollow' },
  ]}),
  component: AdminDashboard,
});
