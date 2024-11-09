import React from "react";

interface Trade {
  id: string;
  tradeId: string;
  instrument: string;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  profitLoss: number;
  entryTime: string; // Adjust type as needed
  exitTime: string; // Adjust type as needed
}

interface TradesListProps {
  trades: Trade[];
}

const TradesList: React.FC<TradesListProps> = ({ trades }) => {
  return (
    <ul className="space-y-4">
      {trades.map((trade) => (
        <li key={trade.id} className="p-4 border rounded">
          <h3 className="font-bold">{trade.instrument}</h3>
          <p>Entry Price: {trade.entryPrice}</p>
          <p>Exit Price: {trade.exitPrice}</p>
          <p>Position Size: {trade.positionSize}</p>
          <p>Profit/Loss: {trade.profitLoss}</p>
          <p>Entry Time: {new Date(trade.entryTime).toLocaleString()}</p>
          <p>Exit Time: {new Date(trade.exitTime).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
};

export default TradesList;
