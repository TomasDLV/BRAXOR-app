import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroller from "@/components/layout/SmoothScroller";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroller>
      <Navbar />
      {children}
      <Footer />
    </SmoothScroller>
  );
}
