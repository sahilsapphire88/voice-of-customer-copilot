import { cn } from '../../lib/utils';

export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }: React.HTMLAttributes<HTMLHRElement> & { orientation?: 'horizontal' | 'vertical'; decorative?: boolean }) {
  return (
    <hr
      aria-orientation={orientation}
      aria-hidden={decorative}
      className={cn(
        'bg-secondary-200 border-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
      {...props}
    />
  );
}