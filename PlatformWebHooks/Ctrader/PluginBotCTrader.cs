using System;
using System.Net.Http;
using System.Text;
using System.Collections.Generic;
using cAlgo.API;
using cAlgo.API.Internals;
using System.Linq;
using System.Threading.Tasks;

namespace cAlgo
{
    [Plugin(AccessRights = AccessRights.FullAccess)]
    public class TradeWebhookPlugin : Plugin
    {
        private HttpClient httpClient;
        private CustomFrame frame;
        private TextBox apiKeyTextBox;
        private TextBox apiEndpointTextBox;
        private Button saveButton;
        private TextBlock statusTextBlock;
        private TextBox webAppAccountIdTextBox;

        public string ApiKey
        {
            get => LocalStorage.GetString(nameof(ApiKey)) ?? "";
            set => LocalStorage.SetString(nameof(ApiKey), value);
        }

        public string ApiEndpoint
        {
            get => LocalStorage.GetString(nameof(ApiEndpoint)) ?? "http://localhost:3000/api/trades";
            set => LocalStorage.SetString(nameof(ApiEndpoint), value);
        }

        public string WebAppAccountId
        {
            get => LocalStorage.GetString(nameof(WebAppAccountId)) ?? "";
            set => LocalStorage.SetString(nameof(WebAppAccountId), value);
        }

        private void LogDebug(string message)
        {
            Print($"DEBUG: {message}");
        }

        private void LogError(string context, Exception ex)
        {
            Print($"ERROR in {context}: {ex.Message}");
            if (ex.StackTrace != null) Print($"StackTrace: {ex.StackTrace}");
        }

        private void UpdateStatus(string message)
        {
            BeginInvokeOnMainThread(() => statusTextBlock.Text = message);
        }

        protected override void OnStart()
        {
            httpClient = new HttpClient();
            Positions.Opened += OnPositionOpened;
            Positions.Closed += OnPositionClosed;
            ChartManager.FramesRemoved += OnChartManagerFramesRemoved;

            BeginInvokeOnMainThread(CreateFrame);
        }

        protected override void OnStop()
        {
            Positions.Opened -= OnPositionOpened;
            Positions.Closed -= OnPositionClosed;
            ChartManager.FramesRemoved -= OnChartManagerFramesRemoved;
            httpClient?.Dispose();
        }

        private void OnChartManagerFramesRemoved(FramesRemovedEventArgs obj)
        {
            if (obj.RemovedFrames.Any(f => f == frame)) BeginInvokeOnMainThread(CreateFrame);
        }

        private void CreateFrame()
        {
            frame = ChartManager.AddCustomFrame("Trade Webhook Settings");

            var mainPanel = new StackPanel { Margin = new Thickness(10) };
            mainPanel.AddChild(new TextBlock { Text = "Trade Webhook Configuration", Margin = new Thickness(0, 0, 0, 10) });
            mainPanel.AddChild(new TextBlock { Text = "API Endpoint:", Margin = new Thickness(0, 5, 0, 2) });

            apiEndpointTextBox = new TextBox { Text = ApiEndpoint, Margin = new Thickness(0, 0, 0, 10) };
            mainPanel.AddChild(apiEndpointTextBox);

            mainPanel.AddChild(new TextBlock { Text = "API Key:", Margin = new Thickness(0, 5, 0, 2) });
            apiKeyTextBox = new TextBox { Text = ApiKey, Margin = new Thickness(0, 0, 0, 10) };
            mainPanel.AddChild(apiKeyTextBox);

            mainPanel.AddChild(new TextBlock { Text = "Web App Account ID:", Margin = new Thickness(0, 5, 0, 2) });
            webAppAccountIdTextBox = new TextBox {
                Text = WebAppAccountId,
                Margin = new Thickness(0, 0, 0, 10)
            };
            mainPanel.AddChild(webAppAccountIdTextBox);

            saveButton = new Button { Text = "Save", Margin = new Thickness(0, 5, 0, 5) };
            saveButton.Click += OnSaveButtonClick;
            mainPanel.AddChild(saveButton);

            statusTextBlock = new TextBlock { Margin = new Thickness(0, 5, 0, 0) };
            mainPanel.AddChild(statusTextBlock);

            frame.Child = mainPanel;
        }

        private void OnSaveButtonClick(ButtonClickEventArgs obj)
        {
            WebAppAccountId = webAppAccountIdTextBox.Text;
            ApiKey = apiKeyTextBox.Text;
            ApiEndpoint = apiEndpointTextBox.Text;
            UpdateStatus("Configuration saved");
        }

        private async Task SendTradeData(Dictionary<string, object> data)
        {
            try
            {
                if (string.IsNullOrEmpty(WebAppAccountId))
                {
                    UpdateStatus("Error: Web App Account ID not configured");
                    return;
                }

                // Capture chart screenshot
                var chartImage = ChartManager.CaptureScreenshot();
                var base64Image = Convert.ToBase64String(chartImage);

                data["webAppAccountId"] = WebAppAccountId;
                data["accountBalance"] = Account.Balance;
                data["accountEquity"] = Account.Equity;
                data["marginUsed"] = Account.Margin;
                data["accountLeverage"] = Account.PreciseLeverage;
                data["dailyReturnPercent"] = CalculateDailyReturn();
                data["chartScreenshot"] = base64Image; // Add screenshot to payload

                var jsonData = System.Text.Json.JsonSerializer.Serialize(data);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                if (!string.IsNullOrEmpty(ApiKey)) content.Headers.Add("X-API-Key", ApiKey);

                var response = await httpClient.PostAsync(ApiEndpoint, content);
                UpdateStatus(response.IsSuccessStatusCode ? "Data sent successfully" : $"Error: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                LogError("SendTradeData", ex);
                UpdateStatus($"Error: {ex.Message}");
            }
        }

        private async void OnPositionOpened(PositionOpenedEventArgs args)
        {
            var data = new Dictionary<string, object>
            {
                { "eventType", "POSITION_OPENED" },
                { "tradeId", args.Position.Id.ToString() },
                { "instrument", args.Position.SymbolName },
                { "entryPrice", args.Position.EntryPrice },
                { "positionSize", args.Position.VolumeInUnits },
                { "entryTime", args.Position.EntryTime.ToString("o") },
                { "stopLoss", args.Position.StopLoss },
                { "takeProfit", args.Position.TakeProfit },
                { "positionType", args.Position.TradeType.ToString() },
                { "commission", args.Position.Commissions },
            };
            await SendTradeData(data);
        }

        private async void OnPositionClosed(PositionClosedEventArgs args)
        {
            var position = args.Position;

            // Calculate close price manually if needed
            double closePrice = position.GrossProfit >= 0 ? position.TakeProfit ?? position.EntryPrice
                                                          : position.StopLoss ?? position.EntryPrice;

            var data = new Dictionary<string, object>
            {
                { "eventType", "POSITION_CLOSED" },
                { "tradeId", position.Id.ToString() },
                { "instrument", position.SymbolName },
                { "entryPrice", position.EntryPrice },
                { "exitPrice", closePrice },
                { "positionSize", position.VolumeInUnits },
                { "profitLoss", position.GrossProfit },
                { "commission", position.Commissions },
                { "swap", position.Swap },
                { "pipsGained", (closePrice - position.EntryPrice) / Symbols.GetSymbol(position.SymbolName).PipSize },
                { "entryTime", position.EntryTime.ToString("o") },
                { "exitTime", DateTime.UtcNow.ToString("o") },
                { "duration", (int)(DateTime.UtcNow - position.EntryTime).TotalSeconds },
                { "stopLoss", position.StopLoss },
                { "takeProfit", position.TakeProfit },
                { "positionType", position.TradeType.ToString() }
            };
            await SendTradeData(data);
        }

        private double CalculateDailyReturn()
        {
            var startOfDayBalance = Account.Balance;
            return (Account.Balance - startOfDayBalance) / (startOfDayBalance != 0 ? startOfDayBalance : 1) * 100;
        }
    }

    public class PluginConfig
    {
        public string ApiKey { get; set; }
        public string AccountId { get; set; }
        public string ApiUrl { get; set; }
    }
}
