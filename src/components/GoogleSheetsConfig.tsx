
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getGoogleSheetsConfig, saveGoogleSheetsConfig } from "@/utils/spreadsheet";
import { useToast } from "@/components/ui/use-toast";

export function GoogleSheetsConfig() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheetId, setSheetId] = useState("");
  const { toast } = useToast();

  // Load existing configuration on open
  useEffect(() => {
    if (open) {
      const config = getGoogleSheetsConfig();
      if (config) {
        setApiKey(config.apiKey || "");
        setSpreadsheetId(config.spreadsheetId || "");
        setSheetId(config.sheetId?.toString() || "");
      }
    }
  }, [open]);

  const handleSave = () => {
    // Validate inputs
    if (!apiKey || !spreadsheetId || !sheetId) {
      toast({
        title: "エラー",
        description: "すべてのフィールドを入力してください",
        variant: "destructive",
      });
      return;
    }

    // Save configuration
    saveGoogleSheetsConfig({
      apiKey,
      spreadsheetId,
      sheetId: isNaN(parseInt(sheetId)) ? sheetId : parseInt(sheetId)
    });

    toast({
      title: "保存完了",
      description: "Google Sheets設定が保存されました",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Google Sheets設定
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google Sheets連携設定</DialogTitle>
          <DialogDescription>
            サンプル注文データを送信するためのGoogle Sheets APIの設定を行います。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Google API Key"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="spreadsheet-id" className="text-right">
              スプレッドシートID
            </Label>
            <Input
              id="spreadsheet-id"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              className="col-span-3"
              placeholder="SpreadsheetのID"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-id" className="text-right">
              シートID/インデックス
            </Label>
            <Input
              id="sheet-id"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              className="col-span-3"
              placeholder="シートのIDまたは0から始まるインデックス"
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
