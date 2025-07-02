'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './EngineeringCampus.module.scss';

const EngineeringCampus = () => {
  const params = useParams();
  const campusSlug = params.campus;

  // Mock data for learning tracks
  const learningTracks = [
    {
      id: 1,
      title: "Software Development",
      description: "Master modern programming languages, frameworks, and development methodologies.",
      icon: "💻",
      color: "#00D4FF"
    },
    {
      id: 2,
      title: "System Architecture",
      description: "Design scalable, robust systems that power the digital world.",
      icon: "🏗️",
      color: "#FF6B35"
    },
    {
      id: 3,
      title: "Robotics & Automation",
      description: "Build intelligent machines and automated systems for the future.",
      icon: "🤖",
      color: "#4ECDC4"
    },
    {
      id: 4,
      title: "Embedded Systems",
      description: "Program microcontrollers and create IoT solutions for real-world applications.",
      icon: "⚡",
      color: "#45B7D1"
    },
    {
      id: 5,
      title: "AI & Algorithms",
      description: "Develop intelligent algorithms and machine learning solutions.",
      icon: "🧠",
      color: "#96CEB4"
    },
    {
      id: 6,
      title: "Problem Solving",
      description: "Master analytical thinking and systematic approach to complex challenges.",
      icon: "🎯",
      color: "#FFEAA7"
    }
  ];

  // Mock data for featured courses
  const featuredCourses = [
    {
      id: 1,
      title: "Advanced Software Architecture",
      tagline: "Design systems that scale to millions of users",
      description: "Learn to architect robust, scalable software systems using modern patterns and best practices.",
      instructor: "Dr. Sarah Chen",
      thumbnail: "/images/course-architecture.jpg",
      duration: "12 weeks",
      level: "Advanced"
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      tagline: "From theory to practical AI applications",
      description: "Master the fundamentals of ML algorithms and their real-world applications.",
      instructor: "Prof. Michael Rodriguez",
      thumbnail: "/images/course-ml.jpg",
      duration: "10 weeks",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Robotics Engineering",
      tagline: "Build the robots of tomorrow",
      description: "Design, build, and program autonomous robots using cutting-edge technology.",
      instructor: "Alex Thompson",
      thumbnail: "/images/course-robotics.jpg",
      duration: "14 weeks",
      level: "Advanced"
    },
    {
      id: 4,
      title: "Cloud-Native Development",
      tagline: "Deploy applications that never sleep",
      description: "Master cloud platforms and build resilient, scalable applications.",
      instructor: "Lisa Park",
      thumbnail: "/images/course-cloud.jpg",
      duration: "8 weeks",
      level: "Intermediate"
    }
  ];

  // Mock data for instructors
  const instructors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "Senior Software Architect",
      bio: "Former lead architect at Google with 15+ years building systems that serve billions of users. Passionate about teaching scalable architecture.",
      image: "/images/instructor-sarah.jpg",
      coursesCount: 8,
      expertise: ["System Design", "Scalability", "Microservices"]
    },
    {
      id: 2,
      name: "Prof. Michael Rodriguez",
      role: "AI Research Lead",
      bio: "Leading researcher in machine learning with 20+ publications. Former ML engineer at Tesla and OpenAI.",
      image: "/images/instructor-michael.jpg",
      coursesCount: 12,
      expertise: ["Machine Learning", "Neural Networks", "Computer Vision"]
    }
  ];

  // Mock data for student reviews
  const studentReviews = [
    {
      id: 1,
      name: "Alex Johnson",
      initials: "AJ",
      role: "Software Engineer at Microsoft",
      quote: "The Engineering Campus transformed my career. The hands-on projects and expert mentorship helped me land my dream job.",
      rating: 5,
      course: "Advanced Software Architecture"
    },
    {
      id: 2,
      name: "Maria Santos",
      initials: "MS",
      role: "Robotics Engineer",
      quote: "Incredible learning experience! The robotics track gave me the skills to build autonomous systems from scratch.",
      rating: 5,
      course: "Robotics Engineering"
    },
    {
      id: 3,
      name: "David Kim",
      initials: "DK",
      role: "ML Engineer at Google",
      quote: "The AI track is world-class. I went from knowing nothing about ML to deploying production models in 6 months.",
      rating: 5,
      course: "Machine Learning Fundamentals"
    }
  ];

  return (
    <div className={styles.engineeringCampus}>
      {/* Hero Section with Video Trailer */}
      <section className={styles.hero}>
        <div className={styles.hero__background}>
          <div className={styles.hero__overlay}></div>
          <div className={styles.hero__grid}></div>
        </div>
        <div className={styles.hero__container}>
          <h1 className={styles.hero__title}>
            Welcome to the <span className={styles.hero__highlight}>Engineering Campus</span>
          </h1>
          <p className={styles.hero__subtitle}>
            Where builders, coders, and problem-solvers shape the future.
          </p>
          
          <div className={styles.hero__videoSection}>
            <div className={styles.hero__videoPlaceholder}>
              <div className={styles.hero__videoOverlay}>
                <button className={styles.hero__playButton}>
                  ▶️
                </button>
                <span className={styles.hero__videoText}>Watch Campus Trailer</span>
              </div>
            </div>
          </div>

          <div className={styles.hero__actions}>
            <Link href="/plans" className={styles.hero__cta}>
              Join Engineering Campus
            </Link>
            <Link href="#tracks" className={styles.hero__secondary}>
              Explore Learning Tracks
            </Link>
          </div>
        </div>
      </section>

      {/* About the Campus */}
      <section className={styles.about}>
        <div className={styles.about__container}>
          <h2 className={styles.about__title}>What is the Engineering Campus?</h2>
          <div className={styles.about__content}>
            <p className={styles.about__paragraph}>
              The Engineering Campus is a cutting-edge learning environment designed for the next generation of builders, 
              innovators, and problem-solvers. Here, we don't just teach engineering—we immerse you in a world where 
              theory meets practice, where every concept is reinforced through hands-on projects and real-world applications.
            </p>
            <p className={styles.about__paragraph}>
              Whether you're a seasoned developer looking to master system architecture, a newcomer eager to dive into 
              robotics, or an aspiring AI engineer ready to build intelligent systems, our campus provides the tools, 
              mentorship, and community you need to succeed in the rapidly evolving tech landscape.
            </p>
            <p className={styles.about__paragraph}>
              Our philosophy centers around three core principles: <strong>Learn by Building</strong>, 
              <strong> Think Like an Engineer</strong>, and <strong>Solve Real Problems</strong>. 
              Every course, every project, every interaction is designed to transform you from a student into a 
              confident, capable engineer ready to tackle the challenges of tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Tracks Section */}
      <section id="tracks" className={styles.tracks}>
        <div className={styles.tracks__container}>
          <h2 className={styles.tracks__title}>Your Learning Tracks</h2>
          <div className={styles.tracks__grid}>
            {learningTracks.map((track) => (
              <div key={track.id} className={styles.trackCard}>
                <div className={styles.trackCard__icon} style={{ color: track.color }}>
                  {track.icon}
                </div>
                <h3 className={styles.trackCard__title}>{track.title}</h3>
                <p className={styles.trackCard__description}>{track.description}</p>
                <div className={styles.trackCard__glow} style={{ backgroundColor: track.color }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className={styles.courses}>
        <div className={styles.courses__container}>
          <h2 className={styles.courses__title}>Featured Courses</h2>
          <div className={styles.courses__grid}>
            {featuredCourses.map((course) => (
              <div key={course.id} className={styles.courseCard}>
                <div className={styles.courseCard__thumbnail}>
                  <div className={styles.courseCard__imagePlaceholder}></div>
                  <div className={styles.courseCard__overlay}>
                    <span className={styles.courseCard__level}>{course.level}</span>
                    <span className={styles.courseCard__duration}>{course.duration}</span>
                  </div>
                </div>
                <div className={styles.courseCard__content}>
                  <h3 className={styles.courseCard__title}>{course.title}</h3>
                  <p className={styles.courseCard__tagline}>{course.tagline}</p>
                  <p className={styles.courseCard__description}>{course.description}</p>
                  <p className={styles.courseCard__instructor}>By {course.instructor}</p>
                  <Link href={`/course/${course.id}`} className={styles.courseCard__button}>
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Spotlight */}
      <section className={styles.instructors}>
        <div className={styles.instructors__container}>
          <h2 className={styles.instructors__title}>Meet Your Instructors</h2>
          <div className={styles.instructors__grid}>
            {instructors.map((instructor) => (
              <div key={instructor.id} className={styles.instructorCard}>
                <div className={styles.instructorCard__image}>
                  <div className={styles.instructorCard__imagePlaceholder}></div>
                </div>
                <div className={styles.instructorCard__content}>
                  <h3 className={styles.instructorCard__name}>{instructor.name}</h3>
                  <p className={styles.instructorCard__role}>{instructor.role}</p>
                  <p className={styles.instructorCard__bio}>{instructor.bio}</p>
                  <div className={styles.instructorCard__expertise}>
                    {instructor.expertise.map((skill, index) => (
                      <span key={index} className={styles.instructorCard__skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.instructors__cta}>
            <Link href="/courses?campus=engineering" className={styles.instructors__button}>
              See All Engineering Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Student Reviews */}
      <section className={styles.reviews}>
        <div className={styles.reviews__container}>
          <h2 className={styles.reviews__title}>What Our Students Say</h2>
          <div className={styles.reviews__grid}>
            {studentReviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewCard__header}>
                  <div className={styles.reviewCard__avatar}>
                    {review.initials}
                  </div>
                  <div className={styles.reviewCard__info}>
                    <h4 className={styles.reviewCard__name}>{review.name}</h4>
                    <p className={styles.reviewCard__role}>{review.role}</p>
                  </div>
                  <div className={styles.reviewCard__rating}>
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className={styles.reviewCard__star}>★</span>
                    ))}
                  </div>
                </div>
                <blockquote className={styles.reviewCard__quote}>
                  "{review.quote}"
                </blockquote>
                <p className={styles.reviewCard__course}>{review.course}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCta__background}>
          <div className={styles.finalCta__circuit}></div>
        </div>
        <div className={styles.finalCta__container}>
          <h2 className={styles.finalCta__title}>
            Build the Future. <span className={styles.finalCta__highlight}>Join the Engineering Campus Today.</span>
          </h2>
          <p className={styles.finalCta__subtitle}>
            Join thousands of engineers who are already building tomorrow's technology.
          </p>
          <Link href="/plans" className={styles.finalCta__button}>
            Start Learning
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EngineeringCampus; 