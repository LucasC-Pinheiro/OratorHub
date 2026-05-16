import { CalendarDays, MapPin, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate, initials } from "@/lib/utils";
import type { Talk } from "@/types/talks";

export function TalksTable({
  talks,
  loading,
  emptyState,
}: {
  talks: Talk[];
  loading?: boolean;
  emptyState?: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (talks.length === 0) {
    return <div className="p-4">{emptyState}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Theme</TableHead>
          <TableHead>Speaker</TableHead>
          <TableHead className="hidden md:table-cell">Congregation</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {talks.map((talk) => (
          <TableRow key={talk.id} className="group">
            <TableCell className="font-medium text-foreground">
              <div className="flex flex-col">
                <span className="truncate">{talk.theme}</span>
                <span className="text-xs text-muted-foreground md:hidden">
                  {talk.congregation}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-blue-400/15 text-[10px] font-semibold text-primary">
                  {initials(talk.speaker_name) || (
                    <User className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="truncate text-sm">{talk.speaker_name}</span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant="outline" className="font-normal">
                <MapPin className="mr-1 h-3 w-3" />
                {talk.congregation}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(talk.talk_date)}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
