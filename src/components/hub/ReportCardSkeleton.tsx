import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ReportCardSkeleton() {
  return (
    <Card className="h-full min-h-[220px] border-zinc-100 rounded-2xl bg-white flex flex-col relative overflow-hidden">
      {/* Header Skeleton */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
        <div className="h-3 w-24 bg-zinc-100 animate-pulse rounded" />
        <div className="w-10 h-10 bg-zinc-50 rounded-lg animate-pulse" />
      </CardHeader>

      {/* Content Skeleton */}
      <CardContent className="px-6 flex-grow flex flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-zinc-100 rounded-full animate-pulse" />
           <div className="h-2 w-12 bg-zinc-50 animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-full bg-zinc-100 animate-pulse rounded" />
          <div className="h-6 w-2/3 bg-zinc-100 animate-pulse rounded" />
        </div>
        <div className="space-y-1 mt-4">
          <div className="h-3 w-full bg-zinc-50 animate-pulse rounded" />
          <div className="h-3 w-1/2 bg-zinc-50 animate-pulse rounded" />
        </div>
      </CardContent>
      
      {/* Footer Skeleton */}
      <CardFooter className="px-6 pb-6 pt-2 border-t border-zinc-50 mx-6 mt-2">
        <div className="h-3 w-20 bg-zinc-50 animate-pulse rounded ml-auto" />
      </CardFooter>

      {/* Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </Card>
  );
}
