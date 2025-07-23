using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using System;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class AccommodationReservationService
    {
        private readonly AppDbContext _context;

        public AccommodationReservationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AccommodationReservation> CreateReservationAsync(AccommodationReservationDto bookingDto)
        {
            var accommodation = await _context.Accommodations.FindAsync(bookingDto.AccommodationId);

            if (accommodation == null)
                throw new Exception("Accommodation not found.");

            if (bookingDto.EndDate <= bookingDto.StartDate)
                throw new Exception("Check-out date must be after check-in date.");

            if (bookingDto.Guests < 1 || bookingDto.Guests > accommodation.MaxGuests)
                throw new Exception($"Guests must be between 1 and {accommodation.MaxGuests}.");

            var nights = (bookingDto.EndDate - bookingDto.StartDate).Days;
            if (nights < 1)
                throw new Exception("Stay must be at least one night.");

            var totalAmount = accommodation.PricePerNight * nights;

            var reservation = new AccommodationReservation
            {
                AccommodationId = bookingDto.AccommodationId,
                StartDate = bookingDto.StartDate,
                EndDate = bookingDto.EndDate,
                Guests = bookingDto.Guests,
                CustomerName = bookingDto.CustomerName.Trim(),
                AdditionalRequirements = bookingDto.SpecialRequests?.Trim() ?? string.Empty,
                TotalAmount = totalAmount,
                Status = "Pending",
                BookingDate = DateTime.UtcNow,
                TripId = bookingDto.TripId
            };

            _context.AccommodationReservations.Add(reservation);
            await _context.SaveChangesAsync();

            return reservation;
        }
    }
}
