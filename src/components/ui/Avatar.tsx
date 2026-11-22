import React from 'react';
import { cn } from '../../lib/utils';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

const shapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

export function Avatar({ className, src, alt, fallback, size = 'md', shape = 'circle', ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt || fallback || 'Avatar'}
        className={cn(sizes[size], shapes[shape], 'object-cover', className)}
        onError={() => setImageError(true)}
        {...props}
      />
    );
  }

  const initials = fallback
    ? fallback
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const colorHash = fallback
    ? fallback.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  const hue = colorHash % 360;
  const bgColor = `hsl(${hue}, 70%, 55%)`;

  return (
    <div
      className={cn(sizes[size], shapes[shape], 'flex items-center justify-center font-medium text-white', className)}
      style={{ backgroundColor: bgColor }}
      aria-label={alt || fallback || 'Avatar'}
      {...props}
    >
      {initials}
    </div>
  );
}

export function AvatarGroup({ className, children, max = 5, ...props }: React.HTMLAttributes<HTMLDivElement> & { max?: number; children: React.ReactNode }) {
  const kids = React.Children.toArray(children);
  const visible = kids.slice(0, max);
  const remaining = kids.length - max;

  const moreElement = remaining > 0 ? (
    <div
      className={cn(
        'flex items-center justify-center border-2 border-white',
        sizes.md,
        'rounded-full bg-secondary-100 text-secondary-600 text-xs font-medium'
      )}
      aria-label={`${remaining} more`}
    >
      +{remaining}
    </div>
  ) : null;

  return (
    <div className={cn('flex -space-x-2', className)} {...props}>
      {visible.map((child, index) => (
        <div key={index} className="relative z-[auto]">
          {child}
        </div>
      ))}
      {moreElement}
    </div>
  );
}