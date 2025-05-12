
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getGoogleSheetsConfig, saveGoogleSheetsConfig } from "@/utils/spreadsheet";
import { useToast } from "@/components/ui/use-toast";

export function GoogleSheetsConfig() {
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  // Load existing configuration on open
  useEffect(() => {
    if (open) {
      const config = getGoogleSheetsConfig();
      if (config) {
        setWebhookUrl(config.webhookUrl || "");
      }
    }
  }, [open]);

  const handleSave = () => {
    // Validate inputs
    if (!webhookUrl) {
      toast({
        title: "エラー",
        description: "Webhook URLを入力してください",
        variant: "destructive",
      });
      return;
    }

    // Save configuration
    saveGoogleSheetsConfig({
      webhookUrl
    });

    toast({
      title: "保存完了",
      description: "Google Apps Script設定が保存されました",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Google Apps Script設定
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google Apps Script連携設定</DialogTitle>
          <DialogDescription>
            サンプル注文データを送信するためのGoogle Apps Script WebhookのURLを設定します。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhook-url" className="text-right">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://script.google.com/macros/s/..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
