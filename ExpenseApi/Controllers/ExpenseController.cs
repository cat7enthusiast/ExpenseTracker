using ExpenseTrackerApi.Data;
using ExpenseTrackerApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerApi.Controllers {

    [ApiController]
    [Route("api/Expense")]
    public class ExpenseController : ControllerBase {
        private readonly ExpenseContext _context;

        public ExpenseController(ExpenseContext context) {
            _context = context;
        }

        [HttpGet("timestamp/{date}")]
        public async Task<ActionResult<IEnumerable<Expense>>> getExpenseByTimestamp(string date) {
            var expenses = await _context.Expenses.Where (e => e.Timestamp == date).ToListAsync();
            if (!expenses.Any()) {
                return NotFound($"No expenses found for the date {date}");
            }
            return Ok(expenses);
        }

        [HttpPost("entry")]
        public async Task<ActionResult<Expense>> CreateExpense (CreateExpenseDto dto) {
            string newId;
            do {
                newId = Expense.GenerateId();
            }
            while (await _context.Expenses.AnyAsync(e => e.Id == newId));

            var expense = new Expense (
                newId,
                dto.Description,
                dto.Cost,
                dto.Category,
                dto.Timestamp
            );

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return Ok(expense);
        }
    }
}