import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';

import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ComponentType } from 'react';

export type DashboardNavIcon = ComponentType<SvgIconProps>;

export type DashboardNavItem = {
  href: string;
  label: string;
  Icon: DashboardNavIcon;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { href: '/dashboard/notes', label: 'Notes', Icon: DescriptionOutlinedIcon },
  {
    href: '/dashboard/transcripts',
    label: 'Transcripts',
    Icon: SubtitlesOutlinedIcon,
  },
];
