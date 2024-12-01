import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchProductsProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export function SearchProducts({ searchTerm, onSearch }: SearchProductsProps) {
  return (
    <div className="relative max-w-md mx-auto mb-12 ">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10 w-full bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border-gray-200/20 dark:border-white/[0.08]"
      />
    </div>
  );
}
