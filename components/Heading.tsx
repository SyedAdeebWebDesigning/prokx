import { cn } from "@/lib/utils";

interface HeadingProps {
	children: React.ReactNode;
	className?: string;
}

const Heading = ({ children, className }: HeadingProps) => {
	return (
		<h2 className={cn("text-4xl font-semibold text-center mb-10", className)}>{children}</h2>
	);
};

export default Heading;
