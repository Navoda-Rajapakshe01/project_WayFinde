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

        // GET: api/Todo/trip/{tripId}
        // Retrieves all todo items associated with a specific trip
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItemsByTrip(int tripId)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound("Trip not found");

            var todoItems = await _context.TodoItems
                .Where(t => t.TripId == tripId)
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

        // GET: api/Todo
        // Retrieves all todo items from the database
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
        // Retrieves a specific todo item by its ID
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
        // Creates a new todo item for a trip
        [HttpPost]
        public async Task<ActionResult<TodoItemDTO>> CreateTodoItem([FromBody] TodoItemDTO todoItemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate that the trip exists
            var trip = await _context.Trips.FindAsync(int.Parse(todoItemDto.TripId));
            if (trip == null)
            {
                return BadRequest("Invalid TripId");
            }

            var todoItem = new TodoItem
            {
                TaskName = todoItemDto.TaskName,
                TaskStatus = "Active", // Set default status to "Active"
                TripId = int.Parse(todoItemDto.TripId) // Use TripId from the DTO
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

        // PUT/UPDATE: api/Todo/{id}
        // Updates an existing todo item
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
        // Toggles the completion status of a todo item between Active and Completed
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