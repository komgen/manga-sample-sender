
import { Button } from "@/components/ui/button";
import { getGoogleSheetsConfig } from "@/utils/spreadsheet";

interface SubmissionCompleteProps {
  onReset: () => void;
  onDownload: () => void;
}

export function SubmissionComplete({ onReset, onDownload }: SubmissionCompleteProps) {
  const sheetsConfig = getGoogleSheetsConfig();
  
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">送信完了</h2>
        <p className="mb-2">サンプルが正常に注文されました。</p>
        
        {sheetsConfig ? (
          <p className="text-sm text-muted-foreground">
            注文データは指定されたGoogle Sheetsに送信されました。
            <br />
            スプレッドシートID: {sheetsConfig.spreadsheetId.substring(0, 5)}...{sheetsConfig.spreadsheetId.substring(sheetsConfig.spreadsheetId.length - 5)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Google Sheets連携が設定されていないため、CSVとしてダウンロードできます。
          </p>
        )}
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        {!sheetsConfig && (
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
