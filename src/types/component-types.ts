import { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  className?: string;
}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  defaultValue?: string;
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
  active?: boolean;
  value?: string;
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  value?: string;
}
