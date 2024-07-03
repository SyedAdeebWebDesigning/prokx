interface MaxWidthWrapperProps {
	children: React.ReactNode;
}

const MaxWidthWrapper = ({ children }: MaxWidthWrapperProps) => {
	return <div className="wrapper">{children}</div>;
};

export default MaxWidthWrapper;
