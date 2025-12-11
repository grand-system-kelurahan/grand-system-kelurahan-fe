import { Skeleton } from "../ui/skeleton";

interface TableSkeletonProps {
  rowCount: number;
  columnCount: number;
}

export default function TableSkeleton({
  rowCount,
  columnCount,
}: TableSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex space-x-2">
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="flex-1 rounded-md h-8" />
          ))}
        </div>
      ))}
    </div>
  );
}
