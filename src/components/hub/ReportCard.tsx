import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText } from "lucide-react";

interface ReportCardProps {
  title: string;
  slug: string;
}

export function ReportCard({ title, slug }: ReportCardProps) {
  return (
    <Link href={`/${slug}`} className="block group transition-all">
      <Card className="h-full border-zinc-200 transition-all duration-300 group-hover:border-black group-hover:shadow-md rounded-none bg-white">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="p-2 bg-zinc-50 group-hover:bg-zinc-100 transition-colors">
            <FileText className="w-6 h-6 text-zinc-400 group-hover:text-black transition-colors" />
          </div>
          <CardTitle className="text-xl font-black tracking-tighter text-black uppercase">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold leading-tight">
            Gestão Integrada para acompanhamento corporativo FFA.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">
            Acessar <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
