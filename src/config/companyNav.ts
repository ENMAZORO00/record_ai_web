import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import type { DashboardNavItem } from './dashboardNav';

export const COMPANY_NAV_ITEMS: DashboardNavItem[] = [
  { href: '/dashboard/team', label: 'Team', Icon: GroupIcon },
  { href: '/dashboard/invite', label: 'Invite Members', Icon: PersonAddIcon },
];
