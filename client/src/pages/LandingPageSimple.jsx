import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronDown, LayoutGrid, User, BarChart2, ArrowRight, Sparkles, Zap, Target, BookOpen, Award, Globe, ClipboardCheck, Gem } from 'lucide-react';
import ScrollRevealDemo from '../components/ScrollRevealDemo.jsx';

export function LandingPageSimple() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    
    const role = localStorage.getItem('role');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    const getDashboardPath = () => {
        if (role) {
            if (role === 'student') return '/student';
            if (role === 'faculty') return '/faculty';
            if (role === 'admin') return '/admin';
        }
        return '/login';
    };

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen">
            <div 
                className="scroll-indicator"
                style={{ transform: `scaleX(${scrollProgress / 100})` }}
            />
            
            <header className="header-glass fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-6xl rounded-2xl">
                <div className="flex items-center px-6 py-4">
                    <a href="/" className="text-2xl font-bold text-white flex-shrink-0 mr-8">
                        <span style={{color:'#58A6FF'}}>CODE</span>
                        <span style={{color:'#39C5E4'}}>VENGERS</span>
                    </a>
                    <div className="hidden md:flex items-center space-x-6 flex-grow">
                        <nav className="flex items-center text-sm space-x-6">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                            <a href="#prototype" className="text-gray-300 hover:text-white transition-colors">Platform</a>
                            <a href="#achievements" className="text-gray-300 hover:text-white transition-colors">Student Success</a>
                            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                        </nav>
                        <div className="ml-auto">
                            {role ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-300 text-sm">Logged in as {role}</span>
                                    <Link 
                                        to={getDashboardPath()}
                                        className="btn btn-primary pulse-glow"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all px-6 py-2 rounded-full font-medium"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                    <button className="md:hidden text-white ml-auto" onClick={()=>setMobileOpen(!mobileOpen)}>☰</button>
                </div>
            </header>

            {mobileOpen && (
                <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-40 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="pt-20 px-6">
                        <nav className="space-y-4">
                            <a href="#features" className="block text-lg text-gray-300 hover:text-white" onClick={()=>setMobileOpen(false)}>Features</a>
                            <a href="#prototype" className="block text-lg text-gray-300 hover:text-white" onClick={()=>setMobileOpen(false)}>Platform</a>
                            <a href="#achievements" className="block text-lg text-gray-300 hover:text-white" onClick={()=>setMobileOpen(false)}>Student Success</a>
                            <a href="#contact" className="block text-lg text-gray-300 hover:text-white" onClick={()=>setMobileOpen(false)}>Contact</a>
                        </nav>
                        <div className="mt-6">
                            {role ? (
                                <div className="space-y-4">
                                    <Link 
                                        to={getDashboardPath()} 
                                        className="block text-lg text-white hover:text-blue-300" 
                                        onClick={()=>setMobileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            localStorage.removeItem('role');
                                            localStorage.removeItem('isAuthenticated');
                                            localStorage.removeItem('studentProfile');
                                            setMobileOpen(false);
                                            window.location.reload();
                                        }}
                                        className="block text-lg text-red-400 hover:text-red-300"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="inline-block text-white bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 rounded-full font-medium"
                                    onClick={()=>setMobileOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main>
                <section className="min-h-screen flex items-center relative overflow-hidden pt-24 pb-16">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-12 gpu-accelerated">
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                                <Award className="w-4 h-4" />
                                <span>Transforming Academic Achievement Records</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6 gradient-text">
                                Your Complete Academic Journey,
                                <br />Digitally Verified
                            </h1>
                            <p className="text-lg md:text-xl leading-relaxed mb-8 mx-auto max-w-4xl text-gray-300">
                                A comprehensive platform that transforms how Higher Education Institutions track, verify, and showcase student achievements. From academics to extracurriculars, we make every accomplishment count.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                <Link 
                                    to={role ? getDashboardPath() : '/login'} 
                                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/25"
                                >
                                    <LayoutGrid className="w-6 h-6" />
                                    <span>{role ? 'Open Dashboard' : 'Get Started'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                {!role && (
                                    <a href="#features" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white border border-gray-700 hover:border-gray-600 hover:bg-gray-800/30 transition-all duration-300">
                                        Learn More
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
                                {[
                                    { label: 'Institutions', value: '50+', icon: <Globe className="w-5 h-5" /> },
                                    { label: 'Students', value: '100k+', icon: <User className="w-5 h-5" /> },
                                    { label: 'Activities Tracked', value: '1M+', icon: <ClipboardCheck className="w-5 h-5" /> },
                                    { label: 'Success Rate', value: '95%', icon: <Gem className="w-5 h-5" /> }
                                ].map((stat, index) => (
                                    <div 
                                        key={stat.label} 
                                        className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <div className="flex justify-center mb-2 text-blue-400">{stat.icon}</div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Value Proposition Steps */}
                            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {[
                                    { 
                                        title: 'Capture', 
                                        description: 'Students easily log every achievement, from coursework to club leadership.', 
                                        icon: <Zap className="w-5 h-5" /> 
                                    },
                                    { 
                                        title: 'Verify', 
                                        description: 'Faculty approve entries with a single click, ensuring institutional credibility.', 
                                        icon: <Target className="w-5 h-5" /> 
                                    },
                                    { 
                                        title: 'Showcase', 
                                        description: 'Instantly generate a verified digital portfolio for jobs and higher education.', 
                                        icon: <Sparkles className="w-5 h-5" /> 
                                    },
                                ].map((step, index) => (
                                    <div 
                                        key={step.title} 
                                        className="value-step p-6 rounded-lg hover:bg-white/5 transition-all duration-300 group text-center"
                                    >
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                                {step.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-xl group-hover:text-blue-300 transition-colors mb-2">{step.title}</h3>
                                                <p className="text-sm text-gray-400">{step.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
                    <div className="max-w-6xl mx-auto px-6 relative">
                        <div className="text-center gpu-accelerated mb-16">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium">
                                <Zap className="w-4 h-4" />
                                <span>Comprehensive Features</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Empowering Higher Education with 
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Digital Innovation</span>
                            </h2>
                            <p className="text-lg mx-auto leading-relaxed text-gray-300 max-w-3xl">
                                Our platform provides a robust ecosystem for tracking, verifying, and showcasing academic achievements and extracurricular activities.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Comprehensive Activity Tracking',
                                    desc: 'From academic achievements to extracurricular excellence, capture every aspect of student growth.',
                                    icon: <BookOpen className="w-6 h-6" />,
                                    gradient: 'from-blue-500 to-cyan-500'
                                },
                                {
                                    title: 'Digital Verification System',
                                    desc: 'Instant verification by faculty and administration ensures credibility of every achievement.',
                                    icon: <Award className="w-6 h-6" />,
                                    gradient: 'from-cyan-500 to-green-500'
                                },
                                {
                                    title: 'Advanced Analytics',
                                    desc: 'Gain insights into student performance and institutional effectiveness through detailed analytics.',
                                    icon: <BarChart2 className="w-6 h-6" />,
                                    gradient: 'from-green-500 to-blue-500'
                                }
                            ].map((feature, index) => (
                                <div
                                    key={feature.title}
                                    className="feature-card p-6 rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-900/50 backdrop-blur transition-all duration-300 hover:transform hover:scale-105"
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trusted Institutions Section */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-8">TRUSTED BY LEADING EDUCATIONAL INSTITUTIONS</h3>
                        <div className="flex justify-center items-center gap-12 mt-8 opacity-40 grayscale">
                            {['University of Technology', 'National Institute of Science', 'Global Education Group', 'Innovation Academy', 'Tech University', 'Research Institute'].map((institution) => (
                                <div key={institution} className="text-sm bg-white/5 px-4 py-2 rounded-lg border border-gray-700/50">
                                    {institution}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Interactive Demo Section */}
                <section id="prototype" className="py-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
                    <div className="max-w-6xl mx-auto px-6 text-center relative">
                        <div className="mb-16">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium">
                                <Target className="w-4 h-4" />
                                <span>Interactive Demo</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Explore the 
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> Platform</span>
                            </h3>
                            <p className="text-lg mx-auto leading-relaxed text-gray-300 max-w-3xl">
                                An intuitive interface designed for efficiency and engagement. Experience the future of student achievement tracking.
                            </p>
                        </div>
                        
                        <div className="mockup-container rounded-xl p-8 max-w-4xl mx-auto bg-gray-800/50 border border-gray-700/50 backdrop-blur">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-2xl font-bold text-white">Welcome Back, Alex!</div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <div className="text-left space-y-3">
                                        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                                            <LayoutGrid className="inline w-5 h-5 mr-2 text-blue-400"/>
                                            <span className="text-white font-medium">Dashboard</span>
                                        </div>
                                        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                                            <User className="inline w-5 h-5 mr-2 text-cyan-400"/>
                                            <span className="text-white font-medium">Portfolio</span>
                                        </div>
                                        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                                            <BarChart2 className="inline w-5 h-5 mr-2 text-gray-400"/>
                                            <span className="text-white font-medium">Analytics</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <div className="text-left space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-white font-semibold">Profile Completion</div>
                                            <div className="text-sm text-gray-400">78%</div>
                                        </div>
                                        <div className="w-full rounded-full h-2 bg-gray-700">
                                            <div className="h-2 rounded-full bg-blue-500" style={{width:'78%'}} />
                                        </div>
                                        <div className="text-sm text-gray-400">You're almost there! Add your latest information.</div>
                                        
                                        <div className="mt-6">
                                            <div className="text-white font-semibold mb-3">Recent Activity</div>
                                            <div className="space-y-2">
                                                <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700/50">
                                                    <span className="text-green-400 font-semibold">Approved:</span> "AI in Healthcare" Seminar Certificate.
                                                </div>
                                                <div className="p-3 rounded-md bg-gray-800/50 border border-gray-700/50">
                                                    <span className="text-yellow-400 font-semibold">Pending:</span> Leadership role, Coding Club.
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <div className="text-white font-semibold mb-3">Achievements Overview</div>
                                            <div className="grid grid-cols-4 gap-4 text-center">
                                                <div>
                                                    <div className="text-2xl font-bold text-blue-400">12</div>
                                                    <div className="text-xs text-gray-400">Academics</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-cyan-400">8</div>
                                                    <div className="text-xs text-gray-400">Tech Skills</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-green-400">5</div>
                                                    <div className="text-xs text-gray-400">Leadership</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-purple-400">3</div>
                                                    <div className="text-xs text-gray-400">Community</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="achievements" className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />
                    <div className="max-w-6xl mx-auto px-6 relative">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium">
                                <Target className="w-4 h-4" />
                                <span>Student Success Stories</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Celebrating Student
                                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Achievements</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    name: "Rahul Kumar",
                                    achievement: "Published Research Paper",
                                    description: "Successfully published research on AI applications in renewable energy, recognized by IEEE."
                                },
                                {
                                    name: "Priya Sharma",
                                    achievement: "National Hackathon Winner",
                                    description: "Led team to victory in Smart India Hackathon 2024, developing innovative EdTech solution."
                                }
                            ].map((story, index) => (
                                <div key={index} className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                                            {story.name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold text-lg mb-1">{story.name}</h3>
                                            <div className="text-green-400 text-sm mb-2">{story.achievement}</div>
                                            <p className="text-gray-400 text-sm">{story.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-24 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
                    <div className="max-w-6xl mx-auto px-6 text-center relative">
                        <div className="p-12 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur">
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
                                <Sparkles className="w-4 h-4" />
                                <span>Ready to Transform?</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Get Started with 
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> CODEVENGERS</span>
                            </h2>
                            <p className="text-lg mx-auto leading-relaxed mb-10 text-gray-300 max-w-3xl">
                                Modernize your institution and empower your students. Schedule a personalized demo today and see the future of education.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <a href="mailto:demo@codevengers.com" className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/25">
                                    <span>Request a Demo</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a href="#features" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white border border-gray-600 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300">
                                    <span>Learn More</span>
                                </a>
                            </div>

                            <div className="max-w-xl mx-auto">
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input type="text" placeholder="Name" className="input-dark w-full" />
                                        <input type="email" placeholder="Email" className="input-dark w-full" />
                                    </div>
                                    <input type="text" placeholder="Institution" className="input-dark w-full" />
                                    <textarea placeholder="Message" rows="4" className="input-dark w-full"></textarea>
                                    <button className="w-full btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3 rounded-lg font-medium">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Scroll Reveal Demo Section */}
                <section className="py-20">
                    <ScrollRevealDemo />
                </section>
            </main>

            <footer className="py-12 border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="text-2xl font-bold mb-4">
                                <span style={{color:'#58A6FF'}}>CODE</span>
                                <span style={{color:'#39C5E4'}}>VENGERS</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Transforming academic achievement tracking for the digital age.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#features" className="hover:text-white">Features</a></li>
                                <li><a href="#prototype" className="hover:text-white">Platform</a></li>
                                <li><a href="#achievements" className="hover:text-white">Success Stories</a></li>
                                <li><a href="#contact" className="hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Team</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Bhavishya Gupta</li>
                                <li>Vipul Agarwal</li>
                                <li>Kushal Agarwal</li>
                                <li>Snehil Khokhar</li>
                                <li>Puru Gupta</li>
                                <li>Shagun</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Connect</h3>
                            <div className="space-y-4 text-sm text-gray-400">
                                <p>Email: contact@codevengers.com</p>
                                <p>Smart India Hackathon 2023</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        <p>© {new Date().getFullYear()} Codevengers. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
