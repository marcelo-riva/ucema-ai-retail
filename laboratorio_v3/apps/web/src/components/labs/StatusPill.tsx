type StatusPillProps = {
  status: string;
  children: React.ReactNode;
  className?: string;
};

export function StatusPill({ status, children, className = "" }: StatusPillProps) {
  return <div className={`statusPill ${status} ${className}`}>{children}</div>;
}
