using System;
using System.Net.Http;
using System.Text;
using System.Collections.Generic;
using NinjaTrader.Gui;
using NinjaTrader.NinjaScript;
using NinjaTrader.Core;
using System.Windows;
using System.Windows.Controls;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;
using System.Windows.Media.Imaging;
using System.Windows.Media;

namespace NinjaTrader.Custom.AddOns
{
    public class TradeWebhookPlugin : AddOnBase
    {
        private HttpClient httpClient;
        private Window configWindow;
        private TextBox apiKeyTextBox;
        private TextBox apiEndpointTextBox;
        private TextBox webAppAccountIdTextBox;
        private TextBlock statusTextBlock;

        // Properties to store settings
        private string ApiKey
        {
            get => NinjaTrader.Core.Globals.UserDataDir.GetValue<string>("WebhookApiKey", "");
            set => NinjaTrader.Core.Globals.UserDataDir.SetValue("WebhookApiKey", value);
        }

        private string ApiEndpoint
        {
            get => NinjaTrader.Core.Globals.UserDataDir.GetValue<string>("WebhookEndpoint", "http://localhost:3000/api/trades");
            set => NinjaTrader.Core.Globals.UserDataDir.SetValue("WebhookEndpoint", value);
        }

        private string WebAppAccountId
        {
            get => NinjaTrader.Core.Globals.UserDataDir.GetValue<string>("WebAppAccountId", "");
            set => NinjaTrader.Core.Globals.UserDataDir.SetValue("WebAppAccountId", value);
        }

        private bool CaptureCharts
        {
            get => NinjaTrader.Core.Globals.UserDataDir.GetValue<bool>("WebhookCaptureCharts", false);
            set => NinjaTrader.Core.Globals.UserDataDir.SetValue("WebhookCaptureCharts", value);
        }

        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                Name = "Trade Webhook";
                Description = "Sends trade data to a webhook endpoint";
            }
            else if (State == State.Configure)
            {
                httpClient = new HttpClient();
                // Subscribe to order events
                Account.OrderUpdate += OnOrderUpdate;
            }
            else if (State == State.Terminated)
            {
                Account.OrderUpdate -= OnOrderUpdate;
                httpClient?.Dispose();
            }
        }

        protected override void OnWindowCreated(Window window)
        {
            // Add menu item to NinjaTrader Control Center
            if (window is Control.ControlCenter)
            {
                MenuItem menuItem = new MenuItem { Header = "Trade Webhook Settings" };
                menuItem.Click += (s, e) => ShowConfigWindow();
                window.MainMenu.Items.Add(menuItem);
            }
        }

        private void ShowConfigWindow()
        {
            configWindow = new Window
            {
                Title = "Trade Webhook Settings",
                Width = 400,
                Height = 300,
                WindowStartupLocation = WindowStartupLocation.CenterScreen,
                ResizeMode = ResizeMode.NoResize
            };

            var mainPanel = new StackPanel { Margin = new Thickness(10) };

            // API Endpoint
            mainPanel.Children.Add(new TextBlock
            {
                Text = "API Endpoint:",
                Margin = new Thickness(0, 5, 0, 2)
            });
            apiEndpointTextBox = new TextBox
            {
                Text = ApiEndpoint,
                Margin = new Thickness(0, 0, 0, 10)
            };
            mainPanel.Children.Add(apiEndpointTextBox);

            // API Key
            mainPanel.Children.Add(new TextBlock
            {
                Text = "API Key:",
                Margin = new Thickness(0, 5, 0, 2)
            });
            apiKeyTextBox = new TextBox
            {
                Text = ApiKey,
                Margin = new Thickness(0, 0, 0, 10)
            };
            mainPanel.Children.Add(apiKeyTextBox);

            // Web App Account ID
            mainPanel.Children.Add(new TextBlock
            {
                Text = "Web App Account ID:",
                Margin = new Thickness(0, 5, 0, 2)
            });
            webAppAccountIdTextBox = new TextBox
            {
                Text = WebAppAccountId,
                Margin = new Thickness(0, 0, 0, 10)
            };
            mainPanel.Children.Add(webAppAccountIdTextBox);

            // Add checkbox for chart capture
            var captureChartsCheckbox = new CheckBox
            {
                Content = "Capture Chart Images",
                IsChecked = CaptureCharts,
                Margin = new Thickness(0, 5, 0, 10)
            };
            mainPanel.Children.Add(captureChartsCheckbox);

            // Save Button
            var saveButton = new Button
            {
                Content = "Save",
                Margin = new Thickness(0, 5, 0, 5),
                Padding = new Thickness(20, 5, 20, 5)
            };
            saveButton.Click += OnSaveButtonClick;
            mainPanel.Children.Add(saveButton);

            // Status Text
            statusTextBlock = new TextBlock
            {
                Margin = new Thickness(0, 5, 0, 0)
            };
            mainPanel.Children.Add(statusTextBlock);

            configWindow.Content = mainPanel;
            configWindow.ShowDialog();
        }

        private void OnSaveButtonClick(object sender, RoutedEventArgs e)
        {
            WebAppAccountId = webAppAccountIdTextBox.Text;
            ApiKey = apiKeyTextBox.Text;
            ApiEndpoint = apiEndpointTextBox.Text;
            CaptureCharts = captureChartsCheckbox.IsChecked ?? false;
            UpdateStatus("Configuration saved");
        }

        private void UpdateStatus(string message)
        {
            if (statusTextBlock != null)
            {
                statusTextBlock.Text = message;
                Output.Process(message, PrintTo.OutputTab1);
            }
        }

        private double CalculateDailyReturn()
        {
            var account = Account.Get();
            var startOfDayBalance = account.CashValue; // This should ideally be stored at start of day
            return (account.CashValue - startOfDayBalance) / (startOfDayBalance != 0 ? startOfDayBalance : 1) * 100;
        }

        private async void OnOrderUpdate(object sender, OrderEventArgs args)
        {
            if (args.Order.OrderState == OrderState.Filled)
            {
                var position = args.Order.Account.Positions.FirstOrDefault(p => p.Instrument == args.Order.Instrument);

                if (args.Order.IsEntry)
                {
                    await SendPositionOpened(args.Order, position);
                }
                else if (args.Order.IsExit)
                {
                    await SendPositionClosed(args.Order, position);
                }
            }
        }

        private async Task SendPositionOpened(Order order, Position position)
        {
            var data = new Dictionary<string, object>
            {
                { "eventType", "POSITION_OPENED" },
                { "tradeId", order.Token.ToString() },
                { "instrument", order.Instrument.FullName },
                { "entryPrice", order.AverageFillPrice },
                { "positionSize", order.Quantity },
                { "entryTime", order.Time.ToString("o") },
                { "stopLoss", order.StopPrice },
                { "takeProfit", order.LimitPrice },
                { "positionType", order.OrderAction.ToString() },
                { "commission", order.Commission }
            };

            await SendTradeData(data);
        }

        private async Task SendPositionClosed(Order order, Position position)
        {
            // Capture chart image if available
            string base64Image = await CaptureChartImage(order.Instrument.FullName);

            var data = new Dictionary<string, object>
            {
                { "eventType", "POSITION_CLOSED" },
                { "tradeId", order.Token.ToString() },
                { "instrument", order.Instrument.FullName },
                { "exitPrice", order.AverageFillPrice },
                { "positionSize", order.Quantity },
                { "profitLoss", position?.RealizedProfitLoss ?? 0 },
                { "commission", order.Commission },
                { "exitTime", order.Time.ToString("o") },
                { "positionType", order.OrderAction.ToString() },
                { "chartImage", base64Image }
            };

            await SendTradeData(data);
        }

        private async Task<string> CaptureChartImage(string instrumentName)
        {
            try
            {
                // Find the chart window for this instrument
                var chartWindow = NinjaTrader.Core.Globals.AllWindows
                    .OfType<NinjaTrader.Gui.Chart.Chart>()
                    .FirstOrDefault(c => c.Instrument?.FullName == instrumentName);

                if (chartWindow == null) return null;

                // Capture the chart
                var visual = chartWindow.MainGrid;
                var bounds = VisualTreeHelper.GetDescendantBounds(visual);
                var bitmap = new RenderTargetBitmap(
                    (int)bounds.Width,
                    (int)bounds.Height,
                    96, 96,
                    PixelFormats.Pbgra32);

                var drawingVisual = new DrawingVisual();
                using (var context = drawingVisual.RenderOpen())
                {
                    var brush = new VisualBrush(visual);
                    context.DrawRectangle(brush, null, new Rect(new Point(), bounds.Size));
                }

                bitmap.Render(drawingVisual);

                // Convert to base64
                var encoder = new PngBitmapEncoder();
                encoder.Frames.Add(BitmapFrame.Create(bitmap));

                using (var stream = new MemoryStream())
                {
                    encoder.Save(stream);
                    byte[] imageBytes = stream.ToArray();
                    return Convert.ToBase64String(imageBytes);
                }
            }
            catch (Exception ex)
            {
                Output.Process($"Error capturing chart: {ex.Message}", PrintTo.OutputTab1);
                return null;
            }
        }

        private async Task<string> CaptureChartWithDrawings(string instrumentName)
        {
            try
            {
                var chartWindow = NinjaTrader.Core.Globals.AllWindows
                    .OfType<NinjaTrader.Gui.Chart.Chart>()
                    .FirstOrDefault(c => c.Instrument?.FullName == instrumentName);

                if (chartWindow == null) return null;

                // Wait for chart to render
                await Task.Delay(100);

                // Create bitmap
                var bitmap = new RenderTargetBitmap(
                    (int)chartWindow.ActualWidth,
                    (int)chartWindow.ActualHeight,
                    96, 96,
                    PixelFormats.Pbgra32);

                bitmap.Render(chartWindow);

                // Convert to base64
                var encoder = new PngBitmapEncoder();
                encoder.Frames.Add(BitmapFrame.Create(bitmap));

                using (var stream = new MemoryStream())
                {
                    encoder.Save(stream);
                    byte[] imageBytes = stream.ToArray();
                    return Convert.ToBase64String(imageBytes);
                }
            }
            catch (Exception ex)
            {
                Output.Process($"Error capturing chart with drawings: {ex.Message}", PrintTo.OutputTab1);
                return null;
            }
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

                var account = Account.Get();

                // Add additional account metrics
                data["webAppAccountId"] = WebAppAccountId;
                data["accountBalance"] = account.CashValue;
                data["accountEquity"] = account.NetLiquidation;
                data["marginUsed"] = account.InitialMargin;
                data["dailyReturnPercent"] = CalculateDailyReturn();

                var jsonData = JsonSerializer.Serialize(data);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                if (!string.IsNullOrEmpty(ApiKey))
                    content.Headers.Add("X-API-Key", ApiKey);

                var response = await httpClient.PostAsync(ApiEndpoint, content);
                UpdateStatus(response.IsSuccessStatusCode ?
                    "Data sent successfully" :
                    $"Error: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error sending trade data: {ex.Message}";
                UpdateStatus(errorMessage);
                Output.Process($"{errorMessage}\nStackTrace: {ex.StackTrace}", PrintTo.OutputTab1);
            }
        }
    }
}
