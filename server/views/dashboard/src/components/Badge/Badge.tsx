import styles from './Badge.module.css';
import { Badge as MantineBadge } from '@mantine/core';
import type { TBadgeProps } from './Badge.model';

const Badge = (props: TBadgeProps) => {
  const {
    children,
    variant = 'filled',
    color,
    size = 'md',
    radius = 'xl',
    className,
    ...rest
  } = props;

  return (
    <MantineBadge
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      className={[styles.badge, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </MantineBadge>
  );
};

export default Badge;
