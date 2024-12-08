import { Strategy } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StrategyBadgeProps {
  strategy: Strategy;
  onUpdate: (id: string, name: string, description: string) => Promise<void>;
}

export function StrategyBadge({ strategy, onUpdate }: StrategyBadgeProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="inline-flex max-w-[200px]">
          <Badge variant="secondary" className="w-full hover:bg-secondary/80 transition-colors cursor-pointer text-sm py-1 px-2">
            <div className="flex items-center w-full">
              <div className="min-w-0 flex-1">
                <span className="truncate block">{strategy.name}</span>
              </div>
              {strategy.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-shrink-0 ml-1.5">
                        <InfoCircledIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-help" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p className="max-w-xs whitespace-pre-wrap">{strategy.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </Badge>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Strategy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" defaultValue={strategy.name} onChange={(e) => (strategy.name = e.target.value)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input id="description" defaultValue={strategy.description || ""} onChange={(e) => (strategy.description = e.target.value)} />
          </div>
          <Button onClick={() => onUpdate(strategy.id, strategy.name, strategy.description || "")}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
