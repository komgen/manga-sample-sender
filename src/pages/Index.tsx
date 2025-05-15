
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/products/MainContent";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          <MainContent />
        </main>
        
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
