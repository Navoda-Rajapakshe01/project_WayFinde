namespace Backend.Models
{
    public class VehicleReservation
    {
        public int Id { get; set; }

        //user info
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string DriversLicenseNumber { get; set; } = string.Empty;

        //Blling info
        public string BillingName { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;


        public DateTime ReservationDate { get; set; } = DateTime.Now;

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

    }
}
