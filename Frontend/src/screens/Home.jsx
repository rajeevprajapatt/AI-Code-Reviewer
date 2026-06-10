import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    Code2, Zap, CheckCircle2, ShieldCheck,
    Terminal, Sparkles, ChevronRight
} from 'lucide-react';


// --- Main Landing Page Component ---

const CodeReviewerLanding = () => {
    const [demoCode, setDemoCode] = useState("function calculateTotal(arr) {\n  let total = 0;\n  for(let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [demoResult, setDemoResult] = useState(null);

    const isLogin = localStorage.getItem("user") ? true : false;

    const handleDemoSubmit = () => {
        setIsAnalyzing(true);
        setDemoResult(null);
        setTimeout(() => {
            setIsAnalyzing(false);
            setDemoResult({
                bug: "Off-by-one error detected in the loop condition (`i <= arr.length`).",
                suggestion: "Change the condition to `i < arr.length` or use `arr.reduce((acc, val) => acc + val, 0)` for a more modern approach.",
                optimization: "Using the built-in `.reduce()` method improves readability and performance."
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">

            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                        <Sparkles className="h-6 w-6 text-blue-600" />
                        <span>SleekReview</span>
                    </div>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
                    </div>
                    <div className="flex gap-4">{
                        !isLogin && <>
                            <Button variant="ghost" className="hidden sm:inline-flex">
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <Button>
                                <Link to="/register">Get Started</Link>
                            </Button>
                        </>
                    }
                        {
                            isLogin && <Button variant="outline" onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                window.location.reload();
                            }}>
                                LogOut
                            </Button>
                        }

                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 mb-8">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Powered by GPT-4 Developer Edition
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
                        Review Your Code with <br className="hidden md:block" />
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI in Seconds
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 mb-10">
                        Instantly detect bugs, get performance optimizations, and enforce best practices. Ship cleaner code faster than ever before.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                        {!isLogin && <Button size="lg" className="h-12 px-8 text-base cursor-pointer shadow-lg shadow-blue-500/20">
                            Get Started for Free
                        </Button>}
                        {isLogin && <Button size="lg" className="h-12 px-8 text-base cursor-pointer shadow-lg shadow-blue-500/20">
                            <Link to="/dashboard">Go to Dashboard</Link>
                        </Button>}

                        <Button variant="outline" size="lg" className="h-12 px-8 text-base cursor-pointer bg-white">
                            <Terminal className="mr-2 h-5 w-5" /> View Demo
                        </Button>
                    </div>

                    {/* Hero Mockup */}
                    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl p-2 shadow-2xl shadow-slate-200/50">
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#0d1117]">
                            <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="mx-auto text-xs text-slate-400 font-mono">script.js</div>
                            </div>
                            <div className="p-6 text-left font-mono text-sm sm:text-base text-slate-300 overflow-x-auto">
                                <p><span className="text-purple-400">function</span> <span className="text-blue-400">optimizeData</span>(payload) {'{'}</p>
                                <p className="pl-4"><span className="text-slate-500">// AI analyzing time complexity...</span></p>
                                <p className="pl-4">return payload.map(item ={'>'} item.value);</p>
                                <p>{'}'}</p>
                                <div className="mt-4 p-3 rounded bg-blue-900/30 border border-blue-500/30 flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <span className="text-blue-200">
                                        <strong className="text-blue-300">Suggestion:</strong> This operation is O(N). Consider memoizing the result if the payload rarely changes to save re-renders.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to write better code</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Our AI engine goes beyond simple linting to understand the context and intent of your codebase.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: ShieldCheck, title: "Bug Detection", desc: "Catch logical errors and edge cases before they make it to production." },
                            { icon: Zap, title: "Code Optimization", desc: "Get real-time suggestions to improve time complexity and performance." },
                            { icon: Code2, title: "Multi-Language", desc: "Supports JS, Python, Rust, Go, Java, and 40+ other languages natively." },
                            { icon: CheckCircle2, title: "Real-time Feedback", desc: "Integrates seamlessly into your workflow with instant PR reviews." }
                        ].map((feature, i) => (
                            <Card key={i} className="group hover:border-blue-200 hover:shadow-md transition-all duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16">How it works</h2>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-linear-to-r from-blue-200 to-purple-200"></div>
                        {[
                            { step: "01", title: "Paste your code", desc: "Drop your snippet or connect your GitHub repository directly." },
                            { step: "02", title: "AI analyzes context", desc: "Our models process your logic, dependencies, and architecture." },
                            { step: "03", title: "Get actionable insights", desc: "Review suggestions, apply fixes with one click, and merge." }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center text-xl font-bold text-blue-600 mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Try it right now</h2>
                        <p className="text-slate-600">Paste a snippet of code below and see the magic happen.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                        <Card className="shadow-lg border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-mono">Input</span>
                            </div>
                            <textarea
                                value={demoCode}
                                onChange={(e) => setDemoCode(e.target.value)}
                                className="w-full h-75 bg-[#1e1e1e] text-slate-300 font-mono p-4 text-sm resize-none focus:outline-none"
                                spellCheck="false"
                            />
                            <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
                                <Button onClick={handleDemoSubmit} disabled={isAnalyzing}>
                                    {isAnalyzing ? "Analyzing..." : "Analyze Code"}
                                    {!isAnalyzing && <ChevronRight className="w-4 h-4 ml-2" />}
                                </Button>
                            </div>
                        </Card>

                        <Card className="shadow-lg border-slate-200 min-h-100 flex flex-col">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center">
                                <span className="text-xs text-slate-500 font-medium font-mono uppercase tracking-wider">AI Analysis Output</span>
                            </div>
                            <div className="p-6 flex-1 bg-white">
                                {!isAnalyzing && !demoResult && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                                        <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                                        Waiting for code input...
                                    </div>
                                )}

                                {isAnalyzing && (
                                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm text-slate-500 animate-pulse">Running diagnostic models...</p>
                                    </div>
                                )}

                                {demoResult && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                            <h4 className="font-semibold text-red-800 flex items-center text-sm mb-1">
                                                <ShieldCheck className="w-4 h-4 mr-2" /> Bug Detected
                                            </h4>
                                            <p className="text-red-600 text-sm">{demoResult.bug}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                            <h4 className="font-semibold text-blue-800 flex items-center text-sm mb-1">
                                                <Zap className="w-4 h-4 mr-2" /> Optimization
                                            </h4>
                                            <p className="text-blue-600 text-sm">{demoResult.optimization}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                                            <h4 className="font-semibold text-green-800 flex items-center text-sm mb-1">
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Suggested Fix
                                            </h4>
                                            <p className="text-green-700 text-sm font-mono bg-white/50 p-2 rounded mt-2 border border-green-200">
                                                {demoResult.suggestion}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter mb-4">
                                <Sparkles className="h-6 w-6 text-blue-600" />
                                <span>SleekReview</span>
                            </div>
                            <p className="text-slate-500 text-sm max-w-xs">
                                Making code reviews painless, fast, and remarkably intelligent. Build better software, faster.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-slate-900">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600">Integrations</a></li>
                                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-slate-900">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-600">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 text-sm text-slate-500">
                        <p>© {new Date().getFullYear()} SleekReview. <br/>Crafted by{" "}
                            <span className="font-bold text-lg leading-[1.1] bg-linear-to-r from-[#F69D25] via-[#9529B1] to-[#F69D25] 
                 bg-clip-text text-transparent bg-size-[200%_200%] animate-textShine">
                                <Link to="https://linkedin.com/in/rajeev-prajapat" target='_blank' rel='noreferrer'>
                                    RAJEEV PRAJAPAT
                                </Link>
                            </span></p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="https://github.com/rajeevprajapatt" target='_blank' rel='noreferrer' className="hover:text-slate-900"><Github className="w-5 h-5" /></a>
                            <a href="https://instagram.com/rajeevprajapatt_" target='_blank' rel='noreferrer' className="hover:text-slate-900" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
                            <a href="https://linkedin.com/in/rajeev-prajapat" target='_blank' rel='noreferrer' className="hover:text-slate-900"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default CodeReviewerLanding;



const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-slate-900 text-white hover:bg-slate-900/90 shadow-sm",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };
    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const Card = ({ className = '', children }) => (
    <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ className = '', children }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className = '', children }) => (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ className = '', children }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Github = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.94-.81 1.76-1 2.5V22"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
);

const Twitter = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const Instagram = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"></line></svg>
);

const Linkedin = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);