//+------------------------------------------------------------------+
//|                                                    WebhookTrader.mq4 |
//|                                          Copyright 2024, Your Company |
//|                                             https://www.yoursite.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, Your Company"
#property link      "https://www.yoursite.com"
#property version   "1.00"
#property strict

// External parameters
input string WebhookURL = "http://localhost:3000/api/trades"; // Webhook URL
input string APIKey = "";                                     // API Key
input string WebAppAccountId = "";                           // Web App Account ID

// Global variables
string lastError = "";
datetime lastDailyStatsUpdate = 0;
double startOfDayBalance = 0;

//+------------------------------------------------------------------+
//| Custom function to send HTTP POST request                          |
//+------------------------------------------------------------------+
int SendWebhookRequest(string url, string postData, string& response)
{
    char post[], result[];
    string headers = "Content-Type: application/json\r\n";
    if (StringLen(APIKey) > 0)
        headers = headers + "X-API-Key: " + APIKey + "\r\n";

    StringToCharArray(postData, post);

    int res = WebRequest(
        "POST",              // Method
        url,                 // URL
        headers,            // Headers
        5000,              // Timeout
        post,              // POST data
        result,            // Server response
        response          // Response headers
    );

    if (res == -1) {
        lastError = "Error in WebRequest: " + GetLastError();
        Print(lastError);
        return -1;
    }

    return res;
}

//+------------------------------------------------------------------+
//| Calculate daily return percentage                                  |
//+------------------------------------------------------------------+
double CalculateDailyReturn()
{
    if (startOfDayBalance == 0 || TimeDay(TimeCurrent()) != TimeDay(lastDailyStatsUpdate)) {
        startOfDayBalance = AccountBalance();
        lastDailyStatsUpdate = TimeCurrent();
    }

    return startOfDayBalance != 0 ?
        (AccountBalance() - startOfDayBalance) / startOfDayBalance * 100 : 0;
}

//+------------------------------------------------------------------+
//| Format trade data as JSON                                         |
//+------------------------------------------------------------------+
string FormatTradeData(int ticket, string eventType)
{
    if (!OrderSelect(ticket, SELECT_BY_TICKET))
        return "";

    string json = "{";
    json += "\"platform\":\"MT4\",";
    json += "\"webAppAccountId\":\"" + WebAppAccountId + "\",";
    json += "\"eventType\":\"" + eventType + "\",";
    json += "\"tradeId\":\"" + IntegerToString(ticket) + "\",";
    json += "\"instrument\":\"" + OrderSymbol() + "\",";
    json += "\"entryPrice\":" + DoubleToString(OrderOpenPrice(), Digits);

    if (eventType == "POSITION_CLOSED") {
        json += ",\"exitPrice\":" + DoubleToString(OrderClosePrice(), Digits);
        json += ",\"profitLoss\":" + DoubleToString(OrderProfit(), 2);
        json += ",\"duration\":" + IntegerToString((int)(TimeCurrent() - OrderOpenTime()));
    }

    json += ",\"positionSize\":" + DoubleToString(OrderLots(), 2);
    json += ",\"entryTime\":\"" + TimeToString(OrderOpenTime(), TIME_DATE|TIME_SECONDS) + "\"";
    json += ",\"stopLoss\":" + DoubleToString(OrderStopLoss(), Digits);
    json += ",\"takeProfit\":" + DoubleToString(OrderTakeProfit(), Digits);
    json += ",\"positionType\":\"" + (OrderType() == OP_BUY ? "Buy" : "Sell") + "\"";
    json += ",\"commission\":" + DoubleToString(OrderCommission(), 2);
    json += ",\"swap\":" + DoubleToString(OrderSwap(), 2);

    // Account information
    json += ",\"accountBalance\":" + DoubleToString(AccountBalance(), 2);
    json += ",\"accountEquity\":" + DoubleToString(AccountEquity(), 2);
    json += ",\"marginUsed\":" + DoubleToString(AccountMargin(), 2);
    json += ",\"accountLeverage\":" + IntegerToString(AccountLeverage());
    json += ",\"dailyReturnPercent\":" + DoubleToString(CalculateDailyReturn(), 2);

    json += "}";
    return json;
}

//+------------------------------------------------------------------+
//| Expert initialization function                                     |
//+------------------------------------------------------------------+
int OnInit()
{
    // Enable WebRequest
    if (!TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)) {
        MessageBox("Please enable AutoTrading to allow web requests", "Error", MB_OK|MB_ICONERROR);
        return INIT_FAILED;
    }

    // Add URL to allowed list
    string terminal_data_path = TerminalInfoString(TERMINAL_DATA_PATH);
    string filename = terminal_data_path + "\\MQL4\\Files\\WebhookURLs.txt";
    int handle = FileOpen(filename, FILE_READ|FILE_WRITE|FILE_TXT);

    if (handle != INVALID_HANDLE) {
        FileWrite(handle, WebhookURL);
        FileClose(handle);
    }

    Print("WebhookTrader initialized successfully");
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                   |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    Print("WebhookTrader stopped");
}

//+------------------------------------------------------------------+
//| Track new orders                                                   |
//+------------------------------------------------------------------+
void OnTrade()
{
    static int lastTicket = 0;

    for(int i = OrdersTotal() - 1; i >= 0; i--) {
        if(OrderSelect(i, SELECT_BY_POS, MODE_TRADES)) {
            int ticket = OrderTicket();

            // New order opened
            if(ticket > lastTicket) {
                string json = FormatTradeData(ticket, "POSITION_OPENED");
                string response = "";
                if(SendWebhookRequest(WebhookURL, json, response) > 0) {
                    Print("Trade opened webhook sent successfully for ticket: ", ticket);
                }
                lastTicket = ticket;
            }
        }
    }

    // Check for closed orders
    for(int i = OrdersHistoryTotal() - 1; i >= 0; i--) {
        if(OrderSelect(i, SELECT_BY_POS, MODE_HISTORY)) {
            if(OrderCloseTime() > 0 && TimeCurrent() - OrderCloseTime() < 10) { // Recently closed
                string json = FormatTradeData(OrderTicket(), "POSITION_CLOSED");
                string response = "";
                if(SendWebhookRequest(WebhookURL, json, response) > 0) {
                    Print("Trade closed webhook sent successfully for ticket: ", OrderTicket());
                }
            }
        }
    }
}

//+------------------------------------------------------------------+
//| Expert tick function                                              |
//+------------------------------------------------------------------+
void OnTick()
{
    // Main logic is handled in OnTrade()
}
