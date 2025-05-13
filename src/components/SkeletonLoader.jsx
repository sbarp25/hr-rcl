import { Skeleton } from "@nextui-org/react";

const SkeletonLoader = () => {
  return (
    <div className="p-5 w-full gap-3 justify-between items-center">
      {/**Item 1 */}
      <div className="w-full flex flex-col space-y-6">
        <div className="w-full flex gap-2 justify-between items-center">
          <div>
            <Skeleton className="flex rounded-lg w-6 h-6" />
          </div>
          <div className="w-full flex gap-4">
            <Skeleton className="h-3 w-1/5 rounded-lg" />
            <Skeleton className="h-3 w-2/5 rounded-lg" />
            <Skeleton className="h-3 w-1/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
        <div className="w-full flex gap-2 justify-between items-center">
          <div>
            <Skeleton className="flex rounded-lg w-6 h-6" />
          </div>
          <div className="w-full flex gap-4">
            <Skeleton className="h-3 w-1/5 rounded-lg" />
            <Skeleton className="h-3 w-2/5 rounded-lg" />
            <Skeleton className="h-3 w-1/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
