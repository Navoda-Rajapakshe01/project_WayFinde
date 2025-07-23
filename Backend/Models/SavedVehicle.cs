using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("SavedVehicles")]
    public class SavedVehicle
    {
        [ForeignKey("Trip")]
        public int TripId { get; set; }

        [ForeignKey("Vehicle")]
        public int VehicleId { get; set; }
    }
} 