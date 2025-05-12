
import { Button } from "@/components/ui/button";
import { getGoogleSheetsConfig } from "@/utils/spreadsheet";

interface SubmissionCompleteProps {
  onReset: () => void;
  onDownload: () => void;
}

export function SubmissionComplete({ onReset, onDownload }: SubmissionCompleteProps) {
  const gasConfig = getGoogleSheetsConfig();
  
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">送信完了</h2>
        <p className="mb-2">サンプルが正常に注文されました。</p>
        
        {gasConfig?.webhookUrl ? (
          <p className="text-sm text-muted-foreground">
            注文データはGoogle Apps Script経由でGoogle Sheetsに送信されました。
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Google Apps Script連携が設定されていないため、CSVとしてダウンロードできます。
          </p>
        )}
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        {!gasConfig?.webhookUrl && (
          <Button onClick={onDownload} variant="outline">
            CSVダウンロード
          </Button>
        )}
        <Button onClick={onReset} className="bg-manga-primary hover:bg-manga-secondary">
          注文を続ける
        </Button>
      </div>
    </div>
  );
}
