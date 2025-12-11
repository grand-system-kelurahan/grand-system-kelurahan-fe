import { RefreshCw } from "lucide-react";

import { Button } from "../ui/button";

interface ButtonRefreshProps {
  onClick: () => void;
}

export default function ButtonRefresh({ onClick }: ButtonRefreshProps) {
  return (
    <Button
      variant="outline"
      className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-600"
      onClick={onClick}>
      <RefreshCw className="w-4 h-4" />
      Refresh
    </Button>
  );
}
