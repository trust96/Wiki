import type { BadgeProps } from '@mantine/core';
import type { ReactNode } from 'react';

export type TBadgeProps = {
  children: ReactNode;
  variant?: 'filled' | 'light' | 'outline' | 'dot' | 'transparent';
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
} & Omit<BadgeProps, 'children' | 'variant' | 'color' | 'size' | 'radius' | 'className'>;
