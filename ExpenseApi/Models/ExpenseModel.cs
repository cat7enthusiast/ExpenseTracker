namespace ExpenseTrackerApi.Models {

    public class Expense {

        public string Id {get; set;} = string.Empty;
        public string Description {get;} = string.Empty;
        public double Cost {get;}
        public string Category {get;} = string.Empty;
        public string Timestamp {get;} = string.Empty;

        public Expense(string description, double cost, string category, string timestamp) {
            Description = description;
            Cost = cost;
            Category = category;
            Timestamp = timestamp;
        }

        public Expense(object value) {}

        public static string GenerateId() {
            return $"E{new Random().Next(1000000, 9999999)}";
        }
    }
}