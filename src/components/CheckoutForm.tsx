
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutFormProps {
  onBack: () => void;
  onSubmit: (data: CheckoutFormData) => void;
}

export interface CheckoutFormData {
  authorName: string;
  email: string;
  mangaTitle: string;
  postalCode: string;
  address: string;
  phoneNumber: string;
  notes: string;
}

const formSchema = z.object({
  authorName: z.string().min(1, { message: "作者名を入力してください" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  mangaTitle: z.string().min(1, { message: "作品タイトルを入力してください" }),
  postalCode: z.string().min(1, { message: "郵便番号を入力してください" }),
  address: z.string().min(1, { message: "住所を入力してください" }),
  phoneNumber: z.string().min(1, { message: "電話番号を入力してください" }),
  notes: z.string().optional(),
});

export function CheckoutForm({ onBack, onSubmit }: CheckoutFormProps) {
  const { items, getCartTotal } = useCart();
  const { toast } = useToast();
  
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorName: "",
      email: "",
      mangaTitle: "",
      postalCode: "",
      address: "",
      phoneNumber: "",
      notes: "",
    },
  });

const handleSubmit = async () => {
    console.log("送信を試みます");
  if (items.length === 0) {
    toast({
      title: "エラー",
      description: "カートにアイテムがありません",
      variant: "destructive",
    });
    return;
  }

  const simplifiedItems = items.map((item) => ({
    商品名: item.product.name,
    サイズ: item.size || "",
    色: item.color || "",
    数量: item.quantity || 0,
  }));

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwA6A6GcApOYaxjIo40jDeCL4V9qNKvjWe0E9m2jzawVt30-uMtcbEagYuZ8DDkPo_F/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(simplifiedItems),
    });

    if (!res.ok) {
      throw new Error("送信エラー");
    }

    toast({
      title: "送信成功",
      description: "アイテム情報を送信しました！",
    });
  } catch (error) {
    toast({
      title: "送信失敗",
      description: "送信中にエラーが発生しました。",
      variant: "destructive",
    });
    console.error("送信失敗:", error);
  }
};


  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">サンプル送付情報</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">選択したアイテム ({getCartTotal()}点)</h3>
        <div className="bg-muted p-4 rounded-md">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex justify-between mb-2">
              <div>
                <p className="font-medium">{item.product.name}</p>
                {(item.color || item.size) && (
                  <p className="text-sm text-muted-foreground">
                    {item.color ? item.color : ''}
                    {item.color && item.size ? ' / ' : ''}
                    {item.size ? item.size : ''}
                  </p>
                )}
              </div>
              <p>{item.quantity}点</p>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>作者名*</FormLabel>
                  <FormControl>
                    <Input placeholder="作者名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="メールアドレス" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="mangaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作品タイトル*</FormLabel>
                <FormControl>
                  <Input placeholder="作品タイトル" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>郵便番号*</FormLabel>
                <FormControl>
                  <Input placeholder="郵便番号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>住所*</FormLabel>
                <FormControl>
                  <Input placeholder="住所" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電話番号*</FormLabel>
                <FormControl>
                  <Input placeholder="電話番号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>備考</FormLabel>
                <FormControl>
                  <Textarea placeholder="補足事項があればご記入ください" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              戻る
            </Button>
            <Button type="submit" className="bg-manga-primary hover:bg-manga-secondary">
              送信する
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
