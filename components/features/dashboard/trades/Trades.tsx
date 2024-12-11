"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardTradeDTO } from "@/lib/dto/dashboard.dto";
import { Sentiment } from "@prisma/client";
import { formatDuration } from "@/lib/utils";
import { updateTradeStrategy, updateTradeSentiment, updateStrategy, getPagedTrades } from "@/lib/actions/trades";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

interface TradesProps {
  initialTrades: DashboardTradeDTO[];
  initialStatistics: TradeStatistics;
}

interface Strategy {
  id: string;
  name: string;
  description?: string;
}

const TRADES_PER_PAGE = 20;

type SortField = "date" | "instrument" | "riskReward" | "commission" | "profitLoss" | "duration" | "sentiment" | "strategy";
type SortOrder = "asc" | "desc";

export default function Trades({ initialTrades, initialStatistics }: TradesProps) {
  const [trades, setTrades] = useState<DashboardTradeDTO[]>(initialTrades);
  const [statistics, setStatistics] = useState<TradeStatistics>(initialStatistics);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [newStrategyName, setNewStrategyName] = useState("");
  const [newStrategyDescription, setNewStrategyDescription] = useState("");
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const response = await fetch("/api/strategies");
      if (!response.ok) throw new Error("Failed to fetch strategies");
      const data = await response.json();
      setStrategies(data);
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  };

  const createStrategy = async () => {
    if (!newStrategyName.trim()) return;

    try {
      const response = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStrategyName,
          description: newStrategyDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to create strategy");

      setNewStrategyName("");
      setNewStrategyDescription("");
      fetchStrategies();
    } catch (error) {
      console.error("Error creating strategy:", error);
    }
  };

  // Filter trades based on search term and filter
  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.instrument.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "wins") return matchesSearch && trade.profitLoss > 0;
    if (filterBy === "losses") return matchesSearch && trade.profitLoss < 0;
    return matchesSearch;
  });

  const handleUpdateStrategy = async (id: string, name: string, description: string) => {
    try {
      await updateStrategy(id, name, description);
      fetchStrategies();
      setEditingStrategy(null);
    } catch (error) {
      console.error("Error updating strategy:", error);
    }
  };

  const lastTradeElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreTrades();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreTrades = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newTrades = await getPagedTrades(nextPage, TRADES_PER_PAGE);

      if (newTrades.length < TRADES_PER_PAGE) {
        setHasMore(false);
      }

      setTrades((prevTrades) => [...prevTrades, ...newTrades]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more trades:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Sort trades based on current sort field and order
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1;

    switch (sortField) {
      case "date":
        return (new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()) * multiplier;
      case "instrument":
        return a.instrument.localeCompare(b.instrument) * multiplier;
      case "riskReward":
        return ((a.riskReward || 0) - (b.riskReward || 0)) * multiplier;
      case "commission":
        return ((a.commission || 0) - (b.commission || 0)) * multiplier;
      case "profitLoss":
        return (a.profitLoss - b.profitLoss) * multiplier;
      case "duration":
        return (a.duration - b.duration) * multiplier;
      case "sentiment":
        return (a.sentiment || "").localeCompare(b.sentiment || "") * multiplier;
      case "strategy":
        return (a.strategyName || "").localeCompare(b.strategyName || "") * multiplier;
      default:
        return 0;
    }
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead onClick={() => handleSort(field)} className="cursor-pointer hover:bg-muted/50">
      <div className="flex items-center gap-1">
        {children}
        <div className="w-4">{sortField === field && (sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}</div>
      </div>
    </TableHead>
  );

  const handleScroll = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreTrades();
    }
  }, [loadMoreTrades]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="p-6 space-y-6">
      {/* Strategy Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input placeholder="Strategy name" value={newStrategyName} onChange={(e) => setNewStrategyName(e.target.value)} className="max-w-xs" />
            <Input placeholder="Description (optional)" value={newStrategyDescription} onChange={(e) => setNewStrategyDescription(e.target.value)} className="max-w-xs" />
            <Button onClick={createStrategy}>Add Strategy</Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {strategies.map((strategy) => (
              <Dialog key={strategy.id}>
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
                      <Input id="name" defaultValue={strategy.name} onChange={(e) => setEditingStrategy({ ...strategy, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <Input id="description" defaultValue={strategy.description || ""} onChange={(e) => setEditingStrategy({ ...strategy, description: e.target.value })} />
                    </div>
                    <Button onClick={() => handleUpdateStrategy(strategy.id, editingStrategy?.name || strategy.name, editingStrategy?.description || strategy.description || "")}>
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total P/L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statistics.totalProfitLoss > 0 ? "text-green-600" : "text-red-600"}`}>${statistics.totalProfitLoss.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statistics.averageProfitLoss.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search by instrument..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter trades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            <SelectItem value="wins">Winning Trades</SelectItem>
            <SelectItem value="losses">Losing Trades</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="date">Date</SortableHeader>
                <SortableHeader field="instrument">Instrument</SortableHeader>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <SortableHeader field="riskReward">R:R</SortableHeader>
                <SortableHeader field="commission">Commission</SortableHeader>
                <TableHead onClick={() => handleSort("profitLoss")} className="cursor-pointer hover:bg-muted/50 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    P/L
                    <div className="w-4">{sortField === "profitLoss" && (sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}</div>
                  </div>
                </TableHead>
                <SortableHeader field="duration">Duration</SortableHeader>
                <SortableHeader field="sentiment">Sentiment</SortableHeader>
                <SortableHeader field="strategy">Strategy</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrades.map((trade, index) => (
                <TableRow key={trade.id} ref={index === sortedTrades.length - 1 ? lastTradeElementRef : undefined}>
                  <TableCell>{new Date(trade.entryTime).toLocaleString()}</TableCell>
                  <TableCell>{trade.instrument}</TableCell>
                  <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                  <TableCell>${trade.exitPrice.toFixed(2)}</TableCell>
                  <TableCell>{trade.riskReward?.toFixed(2) || "-"}</TableCell>
                  <TableCell>${trade.commission?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell className={`text-right ${trade.profitLoss > 0 ? "text-green-600" : "text-red-600"}`}>${trade.profitLoss.toFixed(2)}</TableCell>
                  <TableCell>{formatDuration(trade.duration)}</TableCell>
                  <TableCell>
                    {editingTradeId === trade.id ? (
                      <Select
                        defaultValue={trade.sentiment}
                        onValueChange={async (value) => {
                          await updateTradeSentiment(trade.id, value as Sentiment);
                          setEditingTradeId(null);
                          window.location.reload();
                        }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Positive">Positive</SelectItem>
                          <SelectItem value="Neutral">Neutral</SelectItem>
                          <SelectItem value="Negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => setEditingTradeId(trade.id)}
                        className={`${trade.sentiment === "Positive" ? "text-green-600" : trade.sentiment === "Negative" ? "text-red-600" : ""}`}>
                        {trade.sentiment}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[140px]">
                    {editingTradeId === trade.id ? (
                      <Select
                        defaultValue={trade.strategyId || ""}
                        onValueChange={async (value) => {
                          await updateTradeStrategy(trade.id, value);
                          setEditingTradeId(null);
                          window.location.reload();
                        }}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            {(strategies.find((s) => s.id === trade.strategyId)?.name || "Select Strategy").length > 15
                              ? `${strategies.find((s) => s.id === trade.strategyId)?.name?.substring(0, 15)}...`
                              : strategies.find((s) => s.id === trade.strategyId)?.name || "Select Strategy"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {strategies.map((strategy) => (
                            <SelectItem
                              key={strategy.id}
                              value={strategy.id}
                              title={strategy.description || "No description available"}
                              className="cursor-pointer hover:bg-secondary/80">
                              {strategy.name.length > 15 ? `${strategy.name.substring(0, 15)}...` : strategy.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div
                        onClick={() => setEditingTradeId(trade.id)}
                        className="cursor-pointer hover:text-primary transition-colors truncate"
                        title={`${strategies.find((s) => s.id === trade.strategyId)?.name || "No strategy"}\n${
                          strategies.find((s) => s.id === trade.strategyId)?.description || "No description available"
                        }`}>
                        {strategies.find((s) => s.id === trade.strategyId)?.name || "-"}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {loading && (
            <div className="w-full py-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
