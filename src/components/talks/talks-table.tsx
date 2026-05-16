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
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (talks.length === 0) {
    return <div className="p-4">{emptyState}</div>;
  }

  return (
    <>
      <ul className="divide-y divide-border md:hidden">
        {talks.map((talk) => (
          <li
            key={talk.id}
            className="flex items-start gap-3 px-4 py-3.5 transition-colors active:bg-secondary/40"
          >
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-blue-400/15 text-xs font-semibold text-primary">
              {initials(talk.speaker_name) || <User className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {talk.theme}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {talk.speaker_name}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5">
                  <MapPin className="h-3 w-3" />
                  {talk.congregation}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(talk.talk_date)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tema</TableHead>
              <TableHead>Orador</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead className="text-right">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {talks.map((talk) => (
              <TableRow key={talk.id} className="group">
                <TableCell className="font-medium text-foreground">
                  <span className="block max-w-[24rem] truncate">
                    {talk.theme}
                  </span>
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
                <TableCell>
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
      </div>
    </>
  );
}
