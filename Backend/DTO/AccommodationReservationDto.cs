﻿namespace Backend.DTOs
{
    public class AccommodationReservationDto
    {
        public int AccommodationId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Guests { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string SpecialRequests { get; set; } = string.Empty;
        public int? TripId { get; set; }

        // Add these for payment
        public decimal TotalAmount { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
