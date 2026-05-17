import { CalendarDays, MapPin, MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate, initials } from "@/lib/utils";
import type { Talk } from "@/types/talks";

export type TalkAction = {
  onEdit: (talk: Talk) => void;
  onDelete: (talk: Talk) => void;
};

export function TalksTable({
  talks,
  loading,
  emptyState,
  pendingDeleteId,
  actions,
}: {
  talks: Talk[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  pendingDeleteId?: string | null;
  actions?: TalkAction;
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
        {talks.map((talk) => {
          const isPending = pendingDeleteId === talk.id;
          return (
            <li
              key={talk.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3.5 transition-all duration-200 active:bg-secondary/40",
                isPending && "pointer-events-none opacity-50",
              )}
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
              {actions ? (
                <RowActions
                  talk={talk}
                  actions={actions}
                  pending={isPending}
                />
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tema</TableHead>
              <TableHead>Orador</TableHead>
              <TableHead>Congregação</TableHead>
              <TableHead className="text-right">Data</TableHead>
              {actions ? (
                <TableHead className="w-[60px] text-right">
                  <span className="sr-only">Ações</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {talks.map((talk) => {
              const isPending = pendingDeleteId === talk.id;
              return (
                <TableRow
                  key={talk.id}
                  className={cn(
                    "group transition-all duration-200",
                    isPending && "pointer-events-none opacity-50",
                  )}
                >
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
                  {actions ? (
                    <TableCell className="text-right">
                      <RowActions
                        talk={talk}
                        actions={actions}
                        pending={isPending}
                      />
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowActions({
  talk,
  actions,
  pending,
}: {
  talk: Talk;
  actions: TalkAction;
  pending: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 shrink-0 rounded-full text-muted-foreground transition-all",
            "hover:bg-secondary hover:text-foreground",
            "data-[state=open]:bg-secondary data-[state=open]:text-foreground",
            "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 md:data-[state=open]:opacity-100",
          )}
          disabled={pending}
          aria-label={`Ações para o discurso ${talk.theme}`}
        >
          {pending ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="truncate">
          {talk.speaker_name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => actions.onEdit(talk)}>
          <Pencil className="h-4 w-4 text-muted-foreground" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => actions.onDelete(talk)}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
