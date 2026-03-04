import { useState, useEffect } from "react";
import setting from "./assets/menus.png";
import crow from "./assets/crow.png";
import bg from "./assets/landingpage.webp";

function Corpo(){

    const [ show , setshow ] = useState(false);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [show]);

    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            setshow(false); // Close mobile menu after clicking
        }
    };

    return(
        <div>
            <header>
                <div id="upperfather">
                    <h1 id="corpotext"> CORPO </h1>  
                    <img  onClick={ () => setshow(!show) } id="setting" src={setting} alt="Menu" /> 
                    <nav id="navbarfather2">
                        <ul>
                            <li onClick={() => scrollToSection('about')}>About</li>
                            <li onClick={() => scrollToSection('services')}>Services</li>
                            <li onClick={() => scrollToSection('projects')}>Projects</li>
                            <li onClick={() => scrollToSection('blog')}>Blog</li>
                            <li onClick={() => scrollToSection('contact')}>Contact</li>
                        </ul>
                    </nav>        
                </div>

                { show && <nav className={ show ? "animation" : "" } id="navbarfather">
                    <ul>
                        <li onClick={() => scrollToSection('about')}>About</li>
                        <li onClick={() => scrollToSection('services')}>Services</li>
                        <li onClick={() => scrollToSection('projects')}>Projects</li>
                        <li onClick={() => scrollToSection('blog')}>Blog</li>
                        <li onClick={() => scrollToSection('contact')}>Contact</li>
                    </ul>
                </nav>}    

                <nav id="navpc">
                    <ul>
                        <li onClick={() => scrollToSection('about')}>About</li>
                        <li onClick={() => scrollToSection('services')}>Services</li>
                        <li onClick={() => scrollToSection('projects')}>Projects</li>
                        <li onClick={() => scrollToSection('blog')}>Blog</li>
                        <li onClick={() => scrollToSection('contact')}>Contact</li>
                    </ul>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <section id="hero">
                    <h1 id="fullstack">Full stack</h1>
                    <h1 id="developer">Developer</h1>
                    <h1 id="spiz"> I specialize in building exceptional </h1>
                    <h1 id="dg"> Degital experience </h1>
                    <img id="crow" src={crow}  />
                    <button id="get"  onClick={() => window.open("https://www.fiverr.com/s/qDXBYoZ", "_blank")}> Get Started</button>



                    
                    
                </section>

                {/* About Section */}
                <section id="about" className="content-section">
                    <div className="section-container">
                        <h2 className="section-title">About Me</h2>
                        <div className="about-content">
                            <p className="about-intro">
                                I'm a passionate full-stack developer dedicated to crafting beautiful, 
                                functional web experiences. With expertise in modern technologies and 
                                a keen eye for design, I transform ideas into reality.
                            </p>
                            <div className="skills-grid">
                                <div className="skill-card">
                                    <div className="skill-icon">⚛️</div>
                                    <h3>Frontend</h3>
                                    <p>React, JavaScript, HTML5, CSS3, Responsive Design</p>
                                </div>
                                <div className="skill-card">
                                    <div className="skill-icon">🔧</div>
                                    <h3>Backend</h3>
                                    <p>Supabase, Database Management</p>
                                </div>
                                <div className="skill-card">
                                    <div className="skill-icon">🛠️</div>
                                    <h3>Tools</h3>
                                    <p>Git, VS Code, Ai</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="content-section services-section">
                    <div className="section-container">
                        <h2 className="section-title">Services</h2>
                        <div className="services-grid">
                            <div className="service-card">
                                <div className="service-icon">🎨</div>
                                <h3>Web Design</h3>
                                <p>Modern, responsive designs that captivate your audience and enhance user experience across all devices.</p>
                            </div>
                            <div className="service-card">
                                <div className="service-icon">💻</div>
                                <h3>Web Development</h3>
                                <p>Full-stack development solutions built with cutting-edge technologies and industry best practices.</p>
                            </div>
                            <div className="service-card">
                                <div className="service-icon">📱</div>
                                <h3>Mobile Responsive</h3>
                                <p>Seamless experiences across all devices, from smartphones to desktop screens with pixel-perfect design.</p>
                            </div>
                            <div className="service-card">
                                <div className="service-icon">⚡</div>
                                <h3>Performance</h3>
                                <p>Lightning-fast websites optimized for speed, SEO, and exceptional user engagement.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="content-section">
                    <div className="section-container">
                        <h2 className="section-title">Featured Projects</h2>
                        <div className="projects-grid">
                            <div className="project-card">
                                <div className="project-image">
                                    <div className="project-overlay">
                                        <span className="view-project">View Project →</span>
                                    </div>
                                </div>
                                <div className="project-info">
                                    <h3>E-Commerce Platform</h3>
                                    <p>A modern online shopping experience with seamless checkout and inventory management.</p>
                                    <div className="project-tags">
                                        <span>React</span>
                                        <span>Node.js</span>
                                        <span>MongoDB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="project-card">
                                <div className="project-image project-image-2">
                                    <div className="project-overlay">
                                        <span className="view-project">View Project →</span>
                                    </div>
                                </div>
                                <div className="project-info">
                                    <h3>Portfolio Website</h3>
                                    <p>A stunning portfolio showcasing creative work with smooth animations and transitions.</p>
                                    <div className="project-tags">
                                        <span>React</span>
                                        <span>CSS3</span>
                                        <span>GSAP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="project-card">
                                <div className="project-image project-image-3">
                                    <div className="project-overlay">
                                        <span className="view-project">View Project →</span>
                                    </div>
                                </div>
                                <div className="project-info">
                                    <h3>Task Management App</h3>
                                    <p>An intuitive productivity tool helping teams collaborate and manage projects efficiently.</p>
                                    <div className="project-tags">
                                        <span>React</span>
                                        <span>Firebase</span>
                                        <span>Tailwind</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Section */}
                <section id="blog" className="content-section blog-section">
                    <div className="section-container">
                        <h2 className="section-title">Latest Blog Posts</h2>
                        <div className="blog-grid">
                            <article className="blog-card">
                                <div className="blog-date">Feb 5, 2026</div>
                                <h3>Modern CSS Techniques for 2026</h3>
                                <p>Exploring the latest CSS features that are revolutionizing web design, from container queries to cascade layers.</p>
                                <a href="#" className="read-more">Read More →</a>
                            </article>
                            <article className="blog-card">
                                <div className="blog-date">Jan 28, 2026</div>
                                <h3>React Performance Optimization</h3>
                                <p>Proven strategies to make your React applications blazing fast, from code splitting to memoization techniques.</p>
                                <a href="#" className="read-more">Read More →</a>
                            </article>
                            <article className="blog-card">
                                <div className="blog-date">Jan 15, 2026</div>
                                <h3>The Future of Web Development</h3>
                                <p>A deep dive into emerging trends and technologies shaping the future of the web development landscape.</p>
                                <a href="#" className="read-more">Read More →</a>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="content-section contact-section">
                    <div className="section-container">
                        <h2 className="section-title">Get In Touch</h2>
                        <div className="contact-content">
                            <div className="contact-info">
                                <h3>Let's work together</h3>
                                <p>Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together.</p>
                                <div className="contact-methods">
                                    <div className="contact-method">
                                        <span className="contact-icon">📧</span>
                                        <div>
                                            <h4>Email</h4>
                                            <p>crowcorpo@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="contact-method">
                                        <span className="contact-icon">📱</span>
                                        <div>
                                            <h4>Phone</h4>
                                            <p>Not Available</p>
                                        </div>
                                    </div>
                                    <div className="contact-method">
                                        <span className="contact-icon">📍</span>
                                        <div>
                                            <h4>Location</h4>
                                            <p>Not Available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-content">
                        <p>&copy; 2026 CORPO. All rights reserved.</p>
                        <div className="social-links">
                            <a href="https://www.instagram.com/corpo.crow?igsh=dndqbTV5bHhscGcz" aria-label="GitHub">Instagram</a>
                            <a href="https://www.tiktok.com/@corpo.crow?_r=1&_t=ZS-93oVKO1JL7N" aria-label="LinkedIn">Tiktok</a>
                            <a href="https://www.facebook.com/share/14UwmeT7U2K/" aria-label="Twitter">Facebook</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default Corpo;