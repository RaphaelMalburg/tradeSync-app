//+------------------------------------------------------------------+
//|                                                    WebhookTrader.mq5 |
//|                                          Copyright 2024, Your Company |
//|                                             https://www.yoursite.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, Your Company"
#property link      "https://www.yoursite.com"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>

// External parameters
input string WebhookURL = "http://localhost:3000/api/trades"; // Webhook URL
input string APIKey = "";                                     // API Key
input string WebAppAccountId = "";                           // Web App Account ID

// Global variables
CTrade trade;
CPositionInfo positionInfo;
string lastError = "";
datetime lastDailyStatsUpdate = 0;
double startOfDayBalance = 0;
long lastDealTicket = 0;

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
        lastError = "Error in WebRequest: " + IntegerToString(GetLastError());
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
        startOfDayBalance = AccountInfoDouble(ACCOUNT_BALANCE);
        lastDailyStatsUpdate = TimeCurrent();
    }

    return startOfDayBalance != 0 ?
        (AccountInfoDouble(ACCOUNT_BALANCE) - startOfDayBalance) / startOfDayBalance * 100 : 0;
}

//+------------------------------------------------------------------+
//| Format position data as JSON                                      |
//+------------------------------------------------------------------+
string FormatPositionData(ulong ticket, string eventType, double closePrice = 0)
{
    if (!positionInfo.SelectByTicket(ticket))
        return "";

    string json = "{";
    json += "\"platform\":\"MT5\",";
    json += "\"webAppAccountId\":\"" + WebAppAccountId + "\",";
    json += "\"eventType\":\"" + eventType + "\",";
    json += "\"tradeId\":\"" + IntegerToString(ticket) + "\",";
    json += "\"instrument\":\"" + positionInfo.Symbol() + "\",";
    json += "\"entryPrice\":" + DoubleToString(positionInfo.PriceOpen(), _Digits);

    if (eventType == "POSITION_CLOSED") {
        json += ",\"exitPrice\":" + DoubleToString(closePrice, _Digits);
        json += ",\"profitLoss\":" + DoubleToString(positionInfo.Profit() + positionInfo.Swap() + positionInfo.Commission(), 2);
        json += ",\"duration\":" + IntegerToString((int)(TimeCurrent() - positionInfo.Time()));
    }

    json += ",\"positionSize\":" + DoubleToString(positionInfo.Volume(), 2);
    json += ",\"entryTime\":\"" + TimeToString(positionInfo.Time(), TIME_DATE|TIME_SECONDS) + "\"";
    json += ",\"stopLoss\":" + DoubleToString(positionInfo.StopLoss(), _Digits);
    json += ",\"takeProfit\":" + DoubleToString(positionInfo.TakeProfit(), _Digits);
    json += ",\"positionType\":\"" + (positionInfo.PositionType() == POSITION_TYPE_BUY ? "Buy" : "Sell") + "\"";
    json += ",\"commission\":" + DoubleToString(positionInfo.Commission(), 2);
    json += ",\"swap\":" + DoubleToString(positionInfo.Swap(), 2);

    // Account information
    json += ",\"accountBalance\":" + DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE), 2);
    json += ",\"accountEquity\":" + DoubleToString(AccountInfoDouble(ACCOUNT_EQUITY), 2);
    json += ",\"marginUsed\":" + DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN), 2);
    json += ",\"accountLeverage\":" + IntegerToString(AccountInfoInteger(ACCOUNT_LEVERAGE));
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
    if(!TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)) {
        MessageBox("Please enable AutoTrading to allow web requests", "Error", MB_OK|MB_ICONERROR);
        return INIT_FAILED;
    }

    // Add URL to allowed list
    string terminal_data_path = TerminalInfoString(TERMINAL_DATA_PATH);
    string filename = terminal_data_path + "\\MQL5\\Files\\WebhookURLs.txt";
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
//| Track trades using OnTrade event                                   |
//+------------------------------------------------------------------+
void OnTrade()
{
    // Get the last deal ticket from history
    HistorySelect(0, TimeCurrent());
    int dealsTotal = HistoryDealsTotal();

    if(dealsTotal > 0) {
        ulong dealTicket = HistoryDealGetTicket(dealsTotal - 1);

        // Skip if we've already processed this deal
        if(dealTicket <= lastDealTicket)
            return;

        lastDealTicket = dealTicket;

        ENUM_DEAL_ENTRY dealEntry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(dealTicket, DEAL_ENTRY);
        ENUM_DEAL_TYPE dealType = (ENUM_DEAL_TYPE)HistoryDealGetInteger(dealTicket, DEAL_TYPE);
        ulong positionTicket = HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID);

        // Position opened
        if(dealEntry == DEAL_ENTRY_IN) {
            string json = FormatPositionData(positionTicket, "POSITION_OPENED");
            if(StringLen(json) > 0) {
                string response = "";
                if(SendWebhookRequest(WebhookURL, json, response) > 0) {
                    Print("Position opened webhook sent successfully for ticket: ", positionTicket);
                }
            }
        }
        // Position closed
        else if(dealEntry == DEAL_ENTRY_OUT) {
            double closePrice = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
            string json = FormatPositionData(positionTicket, "POSITION_CLOSED", closePrice);
            if(StringLen(json) > 0) {
                string response = "";
                if(SendWebhookRequest(WebhookURL, json, response) > 0) {
                    Print("Position closed webhook sent successfully for ticket: ", positionTicket);
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
