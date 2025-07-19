using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;


namespace Backend.Services
{
    public class BlobService
    {
        private readonly string? _connectionString;
        private readonly string? _containerName;

        public BlobService(IConfiguration configuration)
        {
            _connectionString = configuration["AzureBlobStorage:ConnectionString"];
            _containerName = configuration["AzureBlobStorage:ContainerName"];
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (_connectionString == null || _containerName == null)
            {
                throw new InvalidOperationException("Azure Blob Storage configuration is missing");
            }
            
            var blobClient = new BlobContainerClient(_connectionString, _containerName);
            await blobClient.CreateIfNotExistsAsync();

            var blob = blobClient.GetBlobClient(file.FileName);
            using var stream = file.OpenReadStream();
            await blob.UploadAsync(stream, overwrite: true);

            return blob.Uri.ToString();
        }
    }
}
