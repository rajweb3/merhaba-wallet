import { Inter } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <nav>
        <HeaderNav />
      </nav>
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
