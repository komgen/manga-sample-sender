
import { useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { ProductFilter } from "@/components/ProductFilter";
import { SubmissionComplete } from "@/components/SubmissionComplete";
import { products } from "@/data/products";
import { ProductType } from "@/types/product";
import { downloadCsv, submitToSpreadsheet } from "@/utils/spreadsheet";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

// Define the steps of the application flow
type Step = "products" | "confirmation" | "complete";

function MainContent() {
  const [step, setStep] = useState<Step>("products");
  const [selectedType, setSelectedType] = useState<ProductType | "all">("all");
  const [csvData, setCsvData] = useState<string | null>(null);
  
  const { items, clearCart } = useCart();
  const { toast } = useToast();

  // Filter products by type
  const filteredProducts = selectedType === "all"
    ? products
    : products.filter(product => product.type === selectedType);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "エラー",
        description: "カートにアイテムがありません",
        variant: "destructive",
      });
      return;
    }
    
    setStep("confirmation");
  };

  const handleBackToProducts = () => {
    setStep("products");
  };

  const handleSubmit = async () => {
    try {
      // Since we're not collecting any form data, just submit the cart items
      const emptyFormData = {
        authorName: "",
        email: "",
        mangaTitle: "",
        postalCode: "",
        address: "",
        phoneNumber: "",
        notes: ""
      };
      
      const result = await submitToSpreadsheet(emptyFormData, items);
      
      if (result.success) {
        toast({
          title: "送信成功",
          description: result.message,
        });
        
        if (result.csvData) {
          setCsvData(result.csvData);
        }
        
        setStep("complete");
      } else {
        toast({
          title: "送信エラー",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "予期せぬエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCsv = () => {
    if (csvData) {
      downloadCsv(csvData);
    }
  };

  const handleReset = () => {
    clearCart();
    setCsvData(null);
    setStep("products");
    setSelectedType("all");
  };

  return (
    <>
      {step === "products" && (
        <div className="container py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">漫画グッズサンプル選択</h1>
            <CartDrawer onCheckout={handleCheckout} />
          </div>
          
          <div className="mb-8">
            <ProductFilter 
              selectedType={selectedType} 
              onTypeChange={setSelectedType} 
            />
          </div>
          
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
      
      {step === "confirmation" && (
        <ConfirmationScreen onBack={handleBackToProducts} onSubmit={handleSubmit} />
      )}
      
      {step === "complete" && (
        <SubmissionComplete onDownload={handleDownloadCsv} onReset={handleReset} />
      )}
    </>
  );
}

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <header className="bg-manga-primary text-white py-4">
          <div className="container">
            <h1 className="text-xl font-bold">漫画商品サンプル送付システム</h1>
          </div>
        </header>
        
        <main>
          <MainContent />
        </main>
        
        <footer className="bg-manga-dark text-white py-4 mt-12">
          <div className="container text-center text-sm">
            <p>© 2025 漫画サンプル送付システム</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default Index;
