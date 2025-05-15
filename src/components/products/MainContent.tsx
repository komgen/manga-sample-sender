
import { useState } from "react";
import { ProductsPage } from "@/components/products/ProductsPage";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { SubmissionComplete } from "@/components/SubmissionComplete";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { submitToSpreadsheet } from "@/utils/spreadsheet";
import { downloadCsv } from "@/utils/spreadsheet";

// Define the steps of the application flow
type Step = "products" | "confirmation" | "complete";

export function MainContent() {
  const [step, setStep] = useState<Step>("products");
  const [csvData, setCsvData] = useState<string | null>(null);
  
  const { items, clearCart } = useCart();
  const { toast } = useToast();

  const handleGoToCheckout = () => {
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
  };

  return (
    <>
      {step === "products" && (
        <ProductsPage onGoToCheckout={handleGoToCheckout} />
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
