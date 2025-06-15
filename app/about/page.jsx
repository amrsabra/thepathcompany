import Header from '../../components/header/Header';
import '../../styles/aboutus.scss';

const AboutUs = () => {
  return (
    <div className="about-page">
      <Header forceSolid={true} />
      <div className="about-container">
        <div className="about-header">
          <h1>About Us</h1>
          <div className="gradient-line"></div>
          <p>Empowering your digital journey with innovative solutions</p>
        </div>

        <div className="content-grid">
          <div className="content-section mission">
            <h2>Our Mission</h2>
            <p>As part of SDG4 - the global goal for quality education - ProjectX is on a mission to make engaging, meaningful learning accessible to all across the MENA region.</p>
          </div>

          <div className="content-section vision">
            <h2>Our Vision</h2>
            <p>We empower learners through cinematic courses that educate, inspire, and unlock real-world potential. Our vision is to lead a new era of education in the MENA region.</p>
          </div>

          <div className="content-section values">
            <h2>Our Values</h2>
            <ul>
              <li>Raising the Standard</li>
              <li>Fueling Ambition</li>
              <li>Obssessed with Quality</li>
              <li>Powered by Learners</li>
            </ul>
          </div>

          <div className="content-section team">
            <h2>Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-image"></div>
                <h3>Abdel. Adel</h3>
                <p>Head of Production</p>
              </div>
              <div className="team-member">
                <div className="member-image"></div>
                <h3>Amr Sabra</h3>
                <p>Head of Innovation & Development</p>
              </div>
              <div className="team-member">
                <div className="member-image"></div>
                <h3>Ahmed Tarek</h3>
                <p>Head of Marketing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <h2>Be Part of Our Mission</h2>
          <p>Join us in transforming the future of education.</p>
          <button className="contact-button">Join Mission</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 