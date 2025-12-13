// src/components/analytics/AnalyticsTracker.tsx
import React from 'react';

type AnalyticsTrackerProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  component?: React.ElementType;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any; // Allow any other props
};

/**
 * A component that wraps children with analytics tracking capabilities.
 * It adds a data-analytics-id attribute to help the analytics system identify interactions.
 */
const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({
  id,
  children,
  className,
  asChild = false,
  component: Component = 'div',
  onClick,
  ...props
}) => {
  // If we want to use the child component directly
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      'data-analytics-id': id,
      onClick: (e: React.MouseEvent) => {
        // Call the original onClick if it exists
        if (child.props.onClick) {
          child.props.onClick(e);
        }
        // Call the onClick passed to this component
        if (onClick) {
          onClick(e);
        }
      },
      ...props
    });
  }

  // Otherwise wrap with the specified component
  return (
    <Component
      className={className}
      data-analytics-id={id}
      onClick={(e: React.MouseEvent) => {
        if (onClick) {
          onClick(e);
        }
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default AnalyticsTracker;