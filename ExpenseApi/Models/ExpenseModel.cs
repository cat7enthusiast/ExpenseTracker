public class Expense {
    public string Id { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Cost { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    
    public Expense() { }  // EF needs a parameterless constructor
    
    public Expense(string id, string description, double cost, string category, string timestamp) {
        Id = id;
        Description = description;
        Cost = cost;
        Category = category;
        Timestamp = timestamp;
    }
    
    public static string GenerateId() {
        return $"E{new Random().Next(1000000, 9999999)}";
    }
}