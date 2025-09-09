import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface SearchBoxProps {
  search: string;
  handleChange: (value: string) => void;
  debounceChange: (value: string) => void;
  className?: string;
}

export function SearchBox({ search, handleChange, className, debounceChange }: SearchBoxProps) {
  const timeoutRef = useRef<number | null>(null);

  // Clear any pending timeout when search changes externally
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleChange(value);
    // Clear previous timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = window.setTimeout(() => {
      debounceChange(value);
    }, 500);
  };
  return (
    <div className={cn('relative bg-background', className)}>
      <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Quick search..."
        value={search}
        onChange={handleInputChange}
        className="pl-8 h-[40px]"
      />
    </div>
  )
}