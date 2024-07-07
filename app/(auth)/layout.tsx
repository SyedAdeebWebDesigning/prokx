const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex-center min-h-screen w-full flex items-center justify-center bg-cover bg-fixed bg-center bg-primary/[0.05] bg-dotted-pattern">
			{children}
		</div>
	);
};

export default Layout;
