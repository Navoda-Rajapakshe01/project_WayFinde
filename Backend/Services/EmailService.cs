using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace Backend.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string email, string resetUrl);
    }
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetUrl)
        {
            var mailSettings = _config.GetSection("MailSettings");
            var smtpServer = mailSettings["SmtpServer"];
            var smtpPort = int.Parse(mailSettings["SmtpPort"]);
            var smtpUsername = mailSettings["SmtpUsername"];
            var smtpPassword = mailSettings["SmtpPassword"];
            var senderEmail = mailSettings["SenderEmail"];
            var senderName = mailSettings["SenderName"];

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Password Reset Request";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                <h2>Reset Your Password</h2>
                <p>Hello,</p>
                <p>You requested to reset your password. Click the link below to create a new password:</p>
                <p><a href='{resetUrl}'>Reset Password</a></p>
                <p>This link will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you,<br>WayFinde Team</p>",
                TextBody = $"Reset your password by clicking this link: {resetUrl}"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new MailKit.Net.Smtp.SmtpClient();
            await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUsername, smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}