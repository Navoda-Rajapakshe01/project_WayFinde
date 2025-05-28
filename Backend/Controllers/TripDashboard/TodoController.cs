using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTO;
using System.Linq;
using System;

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
        public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
        {
            var todoItems = await _context.TodoItems
                .Select(t => new TodoItemDTO
                {
                    Id = t.Id.ToString(),
                    TaskName = t.TaskName,
                    TaskStatus = t.TaskStatus,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    TripId = t.TripId.ToString()
                })
                .ToListAsync();
            return Ok(todoItems);
        }

        // GET: api/Todo/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItemDTO>> GetTodoItem(int id)
        {
            var todoItem = await _context.TodoItems
                .Where(t => t.Id == id)
                .Select(t => new TodoItemDTO
                {
                    Id = t.Id.ToString(),
                    TaskName = t.TaskName,
                    TaskStatus = t.TaskStatus,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    TripId = t.TripId.ToString()
                })
                .FirstOrDefaultAsync();

            if (todoItem == null)
            {
                return NotFound();
            }

            return Ok(todoItem);
        }

        // POST: api/Todo
        [HttpPost]
        public async Task<ActionResult<TodoItemDTO>> CreateTodoItem([FromBody] TodoItemDTO todoItemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var todoItem = new TodoItem
            {
                TaskName = todoItemDto.TaskName,
                TaskStatus = "Active", // Set default status to "Active"
                TripId = 1 // Set default TripId to 1
            };

            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            var createdItem = new TodoItemDTO
            {
                Id = todoItem.Id.ToString(),
                TaskName = todoItem.TaskName,
                TaskStatus = todoItem.TaskStatus,
                CreatedAt = todoItem.CreatedAt,
                UpdatedAt = todoItem.UpdatedAt,
                TripId = todoItem.TripId.ToString()
            };

            return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, createdItem);
        }

        // PUT: api/Todo/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<TodoItemDTO>> UpdateTodoItem(int id, [FromBody] TodoItemDTO todoItemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            todoItem.TaskName = todoItemDto.TaskName;
            todoItem.TaskStatus = todoItemDto.TaskStatus;
            todoItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var updatedItem = new TodoItemDTO
            {
                Id = todoItem.Id.ToString(),
                TaskName = todoItem.TaskName,
                TaskStatus = todoItem.TaskStatus,
                CreatedAt = todoItem.CreatedAt,
                UpdatedAt = todoItem.UpdatedAt,
                TripId = todoItem.TripId.ToString()
            };

            return Ok(updatedItem);
        }

        // PUT: api/Todo/ToggleStatus/{id}
        // Endpoint to toggle task completion (Active/Completed)
        [HttpPut("ToggleStatus/{id}")]
        public async Task<ActionResult<TodoItemDTO>> ToggleTaskStatus(int id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            todoItem.TaskStatus = (todoItem.TaskStatus == "Active") ? "Completed" : "Active";
            todoItem.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var updatedItem = new TodoItemDTO
            {
                Id = todoItem.Id.ToString(),
                TaskName = todoItem.TaskName,
                TaskStatus = todoItem.TaskStatus,
                CreatedAt = todoItem.CreatedAt,
                UpdatedAt = todoItem.UpdatedAt,
                TripId = todoItem.TripId.ToString()
            };

            return Ok(updatedItem);
        }
    }
}
