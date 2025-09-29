import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreVertical, Pencil, ScrollText, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

interface ActionsCellProps {
  children: ReactNode;
  // Optional: add className for the trigger button
  className?: string;
}

export function ActionsCell({ children, className = "" }: ActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`h-8 w-8 p-0 ${className}`}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper: Action item for the dropdown
interface ActionItemProps {
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
}

export function ActionItem({ icon, onClick, children }: ActionItemProps) {
  return (
    <DropdownMenuItem onClick={onClick} className="flex items-center gap-4 cursor-pointer">
      {icon}
      {children}
    </DropdownMenuItem>
  );
}

interface ActionProps {
  onClick: () => void;
}

export function ViewActionItem({ onClick }: ActionProps) {
  return (
    <ActionItem icon={<Eye />} onClick={onClick} children={"View"} />
  );
}

export function EditActionItem({ onClick }: ActionProps) {
  return (
    <ActionItem icon={<Pencil stroke="#1e3a8a" />} onClick={onClick} children={"Edit"} />
  );
}

export function DeleteActionItem({ onClick }: ActionProps) {
  return (
    <ActionItem icon={<Trash2 stroke="red" />} onClick={onClick} children={"Delete"} />
  );
}

export function LogsActionItem({ onClick }: ActionProps) {
  return (
    <ActionItem icon={<ScrollText stroke="#1e3a8a" />} onClick={onClick} children={"Logs"} />
  );
}

export function HeaderDeleteBtn({ length, onClick }: ActionProps & { length: number }) {
  if (length)
    return (
      <Button variant="destructive" size="lg" onClick={onClick}>
        <Trash2 /> Delete ({length})
      </Button>
    );
}