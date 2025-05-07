import React from "react";
import "./Footer.css"; // Add styles for the footer
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react"; // Import icons
import "../../App.css";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3 className="footer-logo">WayFinde</h3>
          <p className="footer-tagline">Discover the world with us</p>
          <p className="footer-copyright">
            &copy; {currentYear} WayFinde Travellers. All rights reserved.
          </p>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>Colombo, Sri Lanka</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>info@wayfinde.com</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>+94 xx xxx xxxx</span>
            </div>
          </div>
        </div>

        <div className="footer-center">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/terms">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/blog">Travel Blog</a>
            </li>
          </ul>
        </div>

        <div className="footer-right">
          <h4 className="footer-heading">Connect With Us</h4>
          <ul className="footer-social">
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-icon"
              >
                <Facebook size={20} />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social-icon"
              >
                <Twitter size={20} />
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-icon"
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-icon"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
