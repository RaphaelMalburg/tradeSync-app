# Trading System

## Overview

The trading interface provides real-time trading capabilities and performance tracking.

## Components

### Trades Component

Located in `components/features/dashboard/trades/Trades.tsx`

Key Features:

- Real-time trade execution
- Order book visualization
- Position management
- Risk controls

### Performance Metrics

Located in `components/features/dashboard/metrics/PerformanceMetrics.tsx`

Metrics Tracked:

- P&L tracking
- Trade history
- Performance analytics
- Risk metrics

## Implementation Notes

- Uses server-side rendering for initial data
- WebSocket connections for real-time updates
- Implements error boundaries
- Includes loading states
