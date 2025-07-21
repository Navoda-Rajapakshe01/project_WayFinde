using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
	public class TripDate
	{
		[Key]
		public int TripDateId { get; set; }

		[Required]
		public int TripId { get; set; }
		[ForeignKey("TripId")]
		public Trip Trip { get; set; }

		[Required]
		public int PlaceId { get; set; }
		[ForeignKey("PlaceId")]
		public PlacesToVisit Place { get; set; }

		[Required]
		public DateTime? StartDate { get; set; }

		[Required]
	public DateTime? EndDate { get; set; }
	}
}
