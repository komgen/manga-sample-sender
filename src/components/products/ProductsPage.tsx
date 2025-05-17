import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductFilter } from "@/components/ProductFilter";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Product, ProductType } from "@/types/product";
import { fetchProducts } from "@/utils/productApi";
import { useCart } from "@/contexts/CartContext";
import { products as defaultProducts } from "@/data/products";

interface ProductsPageProps {
  onGoToCheckout: () => void;
}

export function ProductsPage({ onGoToCheckout }: ProductsPageProps) {
  const [selectedType, setSelectedType] = useState<ProductType | "all">("all");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(false);
  
  const { items } = useCart();
  const { toast } = useToast();

  // Fetch products from Google Sheets
  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await fetchProducts();
      
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        toast({
          title: "商品データ更新",
          description: `${fetchedProducts.length}件の商品データを取得しました`,
        });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "エラー",
        description: "商品データの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

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
    
    onGoToCheckout();
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">漫画グッズサンプル選択</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={loadProducts}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                読み込み中...
              </>
            ) : (
              "商品データ更新"
            )}
          </Button>
          <CartDrawer onCheckout={handleCheckout} />
        </div>
      </div>
      
      {/* 商品タイプ選択の UI を非表示 */}
      <div className="mb-8 hidden">
        <ProductFilter 
          selectedType={selectedType} 
          onTypeChange={setSelectedType} 
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>商品データを読み込み中...</span>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>表示できる商品がありません。</p>
          <p className="text-sm text-muted-foreground mt-2">Google Sheets設定を確認してください。</p>
        </div>
      )}
    </div>
  );
}