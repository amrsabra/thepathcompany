import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FiLayers, 
  FiDownload, 
  FiMonitor, 
  FiStar,
  FiSmartphone,
  FiTarget
} from 'react-icons/fi';
import '../styles/membership-benefits.scss';

const benefits = [
  { icon: <FiLayers />, text: 'Access to the every available campus' },
  { icon: <FiDownload />, text: 'Download and watch courses offline anytime' },
  { icon: <FiMonitor />, text: 'Stream lessons on desktop, phone, or smart TV' },
  { icon: <FiSmartphone />, text: 'Learn on the go with the ProjectX app' },
  { icon: <FiTarget />, text: 'AI-powered guidance to help you reach your goals' },
  { icon: <FiStar />, text: 'Access to the exclusive TPC dashboard' }
];

const MembershipBenefits = () => {
  return (
    <section className="membership-benefits">
      <div className="container">
        <div className="membership-benefits__content">
          <div className="membership-benefits__left">
            <h3 className="membership-benefits__header-text">Benefits of ProjectX membership?</h3>
            <div className="membership-benefits__buttons">
              <Link href="/signup" onClick={() => window.scrollTo(0, 0)}>
                <motion.button
                  className="membership-benefits__button membership-benefits__button--primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </Link>
              <Link href="/gift" onClick={() => window.scrollTo(0, 0)}>
                <motion.button
                  className="membership-benefits__button membership-benefits__button--secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Give a Gift
                </motion.button>
              </Link>
            </div>
          </div>
          <div className="membership-benefits__right">
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="benefit-item"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="benefit-icon">{benefit.icon}</span>
                  <span className="benefit-text">{benefit.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipBenefits; 