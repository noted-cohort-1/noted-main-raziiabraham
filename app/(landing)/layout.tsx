import { Navbar } from "./_components/navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-full dark:bg-background">
      <Navbar />
      <main className="h-full pt-20">{children}</main>
    </div>
  );
};

export default LandingLayout;
