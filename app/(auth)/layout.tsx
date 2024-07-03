const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex-center min-h-screen w-full flex items-center justify-center  bg-cover bg-fixed bg-center">
			{children}
		</div>
	);
};

export default Layout;
