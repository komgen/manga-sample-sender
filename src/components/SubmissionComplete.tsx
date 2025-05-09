
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SubmissionCompleteProps {
  onDownload: () => void;
  onReset: () => void;
}

export function SubmissionComplete({ onDownload, onReset }: SubmissionCompleteProps) {
  return (
    <div className="max-w-md mx-auto text-center p-6">
      <div className="mb-6 flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">送信完了</h2>
      <p className="mb-6 text-muted-foreground">
        サンプル送付依頼が正常に送信されました。担当者が確認次第、発送手続きを進めます。
      </p>
      <div className="space-y-4">
        <Button 
          className="w-full bg-manga-primary hover:bg-manga-secondary"
          onClick={onDownload}
        >
          CSVをダウンロード
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReset}
        >
          最初に戻る
        </Button>
      </div>
    </div>
  );
}
