namespace ExpenseTrackerApi.Models 
{
    public class CreateExpenseDto 
    {
        public string Description { get; set; } = string.Empty;
        public double Cost { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
    }
}