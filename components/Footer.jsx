import {
  FiFacebook,
  FiInstagram,
  FiLinkedin
} from 'react-icons/fi'; // Example social icons
import { FaYoutube } from 'react-icons/fa'; // Changed from BsTwitterX to FaYoutube
import { FaGooglePlay, FaApple } from 'react-icons/fa'; // Example app store icons
import '../styles/footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Branding Section */}
          <div className="footer__brand">
            <div className="footer__logo">
              {/* Replace with your actual logo */}
              <span className="gradient-text">The Path Company</span>
            </div>
            <p className="footer__slogan">
              Elevate your skills with expert-led courses and real-world projects
            </p>
            
            {/* Separator line */}
            <div className="footer__separator"></div>
            
            {/* Social Icons */}
            <div className="footer__connect">
              <h3 className="footer__heading">Connect with us</h3>
              <div className="footer__social">
                <a href="#" className="footer__social-icon" aria-label="Facebook">
                  <FiFacebook />
                </a>
                <a href="#" className="footer__social-icon" aria-label="YouTube">
                  <FaYoutube />
                </a>
                <a href="#" className="footer__social-icon" aria-label="Instagram">
                  <FiInstagram />
                </a>
                <a href="#" className="footer__social-icon" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__links">
            <h3 className="footer__heading">Pages</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* About Links */}
          <div className="footer__links">
            <h3 className="footer__heading">About</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Inside ProjectX</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Special CTA and Download */}
          <div className="footer__cta">
            <div className="footer__cta-card">
              <h3 className="footer__cta-title">Produce a course with us</h3>
              <p className="footer__cta-text">Share your expertise with our global audience</p>
              <a href="/produce-course" className="footer__cta-button">Learn More</a>
            </div>
            
            <div className="footer__download">
              <h3 className="footer__heading">Get the app</h3>
              <div className="footer__app-buttons">
                <a href="#" className="footer__app-button">
                  <FaApple /> <span>App Store</span>
                  
                </a>
                <a href="#" className="footer__app-button">
                  <FaGooglePlay /> <span>Google Play</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer__divider"></div>
        
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} ProjectX2. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 