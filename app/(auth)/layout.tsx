const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-center flex min-h-screen w-full items-center justify-center bg-primary/[0.05] bg-dotted-pattern bg-cover bg-fixed bg-center">
      {children}
    </div>
  );
};

export default Layout;
