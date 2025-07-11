using Backend.Models;
using Backend.DTOs;
using System;
using System.Threading.Tasks;
using Backend.Data;

namespace Backend.Services
{
    public class VehicleReservationService
    {
        private readonly AppDbContext _context;

        public VehicleReservationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<VehicleReservation> CreateReservationAsync(VehicleReservationDTO reservationDto)
        {
            var vehicle = await _context.Vehicles.FindAsync(reservationDto.VehicleId);

            if (vehicle == null)
                throw new Exception("Vehicle not found.");

            // Calculate the total amount based on the price per day of the vehicle
            var totalAmount = CalculateTotalAmount(vehicle.PricePerDay, reservationDto.StartDate, reservationDto.EndDate);

            var reservation = new VehicleReservation
            {
                VehicleId = reservationDto.VehicleId,
                Vehicle = vehicle,
                CustomerName = reservationDto.CustomerName,
                StartDate = reservationDto.StartDate,
                EndDate = reservationDto.EndDate,
                PickupLocation = reservationDto.PickupLocation,
                ReturnLocation = reservationDto.ReturnLocation,
                AdditionalRequirements = reservationDto.AdditionalRequirements,
                TotalAmount = totalAmount,
                TripId = reservationDto.TripId  // Conditionally set TripId
            };

            _context.VehicleReservations.Add(reservation);
            await _context.SaveChangesAsync();

            return reservation;
        }

        private decimal CalculateTotalAmount(decimal pricePerDay, DateTime startDate, DateTime endDate)
        {
            var days = (endDate - startDate).Days;
            return pricePerDay * days;
        }
    }
}
