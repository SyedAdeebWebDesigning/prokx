import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

const Heading = ({ children, className }: HeadingProps) => {
  return (
    <h2 className={cn("mb-10 text-center text-4xl font-semibold", className)}>
      {children}
    </h2>
  );
};

export default Heading;
