export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={` rounded-2xl p-4 ${className}`}>{children}</div>;
