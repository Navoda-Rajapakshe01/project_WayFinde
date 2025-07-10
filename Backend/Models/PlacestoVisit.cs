using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
[Index(nameof(Name), nameof(DistrictId), IsUnique = true)]
public class PlacesToVisit
{
        [Key]
    public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string MainImageUrl { get; set; }

        [Required]
        public string Description { get; set; }

        public string History { get; set; }

        public string OpeningHours { get; set; }

        public string Address { get; set; }

        public string GoogleMapLink { get; set; }

        [Required]
    public int DistrictId { get; set; }

        [ForeignKey("DistrictId")]
        public virtual District District { get; set; }

    public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
