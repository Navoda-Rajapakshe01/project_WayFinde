using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor to inject the DbContext
        public TodoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Todo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
        {
            // Return all TodoItems from the database
            var todoItems = await _context.TodoItems.ToListAsync();
            return Ok(todoItems);  // Return status 200 OK with the list of todoItems
        }

        // GET: api/Todo/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(int id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();  // Return 404 Not Found if the item doesn't exist
            }

            return Ok(todoItem);  // Return the found TodoItem with 200 OK status
        }

        // POST: api/Todo
        [HttpPost]
        public async Task<ActionResult<TodoItem>> CreateTodoItem(TodoItem todoItem)
        {
            // Add the new TodoItem to the DbContext
            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            // Return the created TodoItem with status 201 (Created)
            return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
        }

        // PUT: api/Todo/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodoItem(int id, TodoItem todoItem)
        {
            if (id != todoItem.Id)
            {
                return BadRequest();  // Return 400 Bad Request if IDs don't match
            }

            _context.Entry(todoItem).State = EntityState.Modified;  // Mark the entity as modified
            await _context.SaveChangesAsync();

            return NoContent();  // Return 204 No Content on successful update
        }

        // PUT: api/Todo/ToggleStatus/{id}
        // Endpoint to toggle task completion (Active/Completed)
        [HttpPut("ToggleStatus/{id}")]
        public async Task<IActionResult> ToggleTaskStatus(int id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();  // Return 404 if the task does not exist
            }

            // Toggle task status (Active <-> Completed)
            todoItem.TaskStatus = (todoItem.TaskStatus == "Active") ? "Completed" : "Active";

            // Mark the entity as modified and save the changes
            _context.Entry(todoItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(todoItem);  // Return updated TodoItem with 200 OK status
        }


    }
}
