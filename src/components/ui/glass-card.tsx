
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: 'default' | 'deep' | 'dark';
  glowOnHover?: boolean;
  glowColor?: string;
  children: React.ReactNode;
  layoutId?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    children, 
    variant = 'default', 
    glowOnHover = false,
    glowColor = 'teal',
    layoutId,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'glass-panel',
      deep: 'glass-panel-deep',
      dark: 'glass-panel-dark'
    };

    return (
      <motion.div
        ref={ref}
        layoutId={layoutId}
        className={cn(
          variantClasses[variant],
          glowOnHover && 'hover:shadow-lg transition-shadow duration-300',
          glowOnHover && `hover:shadow-${glowColor}-500/20`,
          className
        )}
        whileHover={glowOnHover ? { scale: 1.02 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCardHeader = ({ className, children, ...props }: GlassCardHeaderProps) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
);

GlassCardHeader.displayName = 'GlassCardHeader';

interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const GlassCardTitle = ({ 
  className, 
  children, 
  gradient = false,
  ...props 
}: GlassCardTitleProps) => (
  <h3
    className={cn(
      'text-xl font-bold',
      gradient && 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

GlassCardTitle.displayName = 'GlassCardTitle';

interface GlassCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const GlassCardDescription = ({ className, children, ...props }: GlassCardDescriptionProps) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
);

GlassCardDescription.displayName = 'GlassCardDescription';

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCardContent = ({ className, children, ...props }: GlassCardContentProps) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

GlassCardContent.displayName = 'GlassCardContent';

interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCardFooter = ({ className, children, ...props }: GlassCardFooterProps) => (
  <div
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
);

GlassCardFooter.displayName = 'GlassCardFooter';
