import React, { useState, useEffect } from 'react';
import axios from '../config/AxiosInstance';
import {
    Sparkles, Code2, Play, Bug, Zap, Copy, Check, Loader2, ArrowRight,
    PanelLeft, Search, Clock, MessageSquare, ChevronRight,
    TestTube
} from 'lucide-react';

// --- Main App Interface ---

const Dashboard = () => {
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null
    }); // Simulated logged-in user ID

    const [MOCK_HISTORY, setMOCK_HISTORY] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/ai/getHistory');
                setMOCK_HISTORY(res.data.responses);
            } catch (error) {
                console.error("Error fetching user history:", error);
            }
        }
        fetchHistory();
    }, [])

    console.log(MOCK_HISTORY)

    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeAction, setActiveAction] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [responses, setResponses] = useState({});

    const handlehistoryModification = (oldPrompt, newPrompt) => {
        let spl1 = oldPrompt.split(" ");
        let spl2 = newPrompt.split(" ");

        let filterOldPrompt = spl2.filter(item => item.length > 0)

        let isMatch = spl1.length == filterOldPrompt.length && spl1.every((val, i) => val == filterOldPrompt[i]);

        return isMatch;
    }

    const handleReviewCode = async () => {
        if (!activeHistoryId) {
            const generateResponse = async () => {
                const res = await axios.post('/ai/getAiResult', { prompt: code });
                console.log("AI response : ", res.data.response)
                setResponses(res.data.response);
                setIsLoading(false);
                setCode(res.data.response.prompt);
                setOutput(res.data.response.text);
                setResponses(res.data.response);
                setActiveHistoryId(res.data.response._id);
            }
            generateResponse();
            console.log("Code responses : ", responses)
            // const newResponse = await axios.post('/ai/getAiResult', { prompt: code });
        }
        else {
            if (handlehistoryModification(responses.prompt, code)) {
                const getResponse = async () => {
                    const res = await axios.post('/ai/getDocument', { documentId: activeHistoryId });
                    console.log("AI response : ", res.data.response)
                    setResponses(res.data.response);
                    setIsLoading(false);
                    setCode(res.data.response.prompt);
                    setOutput(res.data.response.text);
                    setResponses(res.data.response);
                }
                getResponse();
            } 
            else{
                const generateResponse = async () => {
                    const res = await axios.post('/ai/getAiResult', { prompt: code });
                    console.log("AI response : ", res.data.response)
                    setResponses(res.data.response);
                    setIsLoading(false);
                    setCode(res.data.response.prompt);
                    setOutput(res.data.response.text);
                    setResponses(res.data.response);
                    setActiveHistoryId(res.data.response._id);
                }
                generateResponse();
                console.log("Code responses : ", responses)
                // const newResponse = await axios.post('/ai/getAiResult', { prompt: code });
            }
        }
    }

    // useEffect(() => {
    //     if(!activeHistoryId) {
    //         const generateResponse = async() => {
    //             const res = await axios.post('/ai/getAiResult', { prompt: code });
    //             console.log("AI response : ", res.data.response)
    //             setResponses(res.data.response);    
    //             setIsLoading(false);
    //             setCode(res.data.response.prompt);
    //             setOutput(res.data.response.text);
    //             setResponses(res.data.response);
    //         }
    //         generateResponse();
    //         console.log("Code responses : ", responses)
    //         // const newResponse = await axios.post('/ai/getAiResult', { prompt: code });
    //     }
    //     else{
    //         const getResponse = async() => {
    //             const res = await axios.post('/ai/getDocument', { documentId: activeHistoryId });
    //             console.log("AI response : ", res.data.response)
    //             setResponses(res.data.response);    
    //             setIsLoading(false);
    //             setCode(res.data.response.prompt);
    //             setOutput(res.data.response.text);
    //             setResponses(res.data.response);
    //         }
    //         getResponse();
    //     }
    // })

    // New Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeHistoryId, setActiveHistoryId] = useState(null);

    console.log("Active history : ", activeHistoryId)

    // Filter history based on search
    const filteredHistory = MOCK_HISTORY.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mock API Call Handler
    const handleAction = (actionName) => {
        if (!code.trim()) return;

        setIsLoading(true);
        setActiveAction(actionName);

        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            setActiveAction(null);

            // const responses = {
            //     'Review Code': "### Code Review Summary\n\nYour code structure is generally good, but there are a few areas for improvement:\n\n1. **Type Safety:** Consider adding standard interfaces for your data payload.\n2. **Error Handling:** There is no try/catch block around the main logic.\n3. **Naming Conventions:** Variable names could be more descriptive.\n\nOverall Rating: 7.5/10",
            //     'Explain Code': "### Code Explanation\n\nThis snippet appears to be a functional block that iterates through a dataset. \n\nIt takes an array as an input, maps over the items, and returns a transformed set of values. The time complexity of this operation is O(N) where N is the length of the input array.",
            //     'Fix Bugs': "### Bug Fixes Applied\n\nI found 1 critical issue and fixed it:\n\n- Fixed an off-by-one error in the loop boundary (`<=` changed to `<`).\n- Added null-checking before accessing the array properties to prevent runtime crashes.",
            //     'Optimize Code': "### Optimizations\n\n- **Memory:** Replaced the standard `for` loop with a higher-order `.map()` function to prevent mutating external state.\n- **Performance:** Memoized the return value to prevent unnecessary re-renders."
            // };

            if (responses[actionName]) {
                console.log(responses[actionName])
                //  = `### ${actionName} Summary\n\n${responses[actionName]}`;
            }

            setOutput(responses[actionName]);
        }, 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const loadHistoryItem = (item) => {
        setActiveHistoryId(item._id);
        setCode(item.prompt);
        setOutput(responses.text)
        // setCode(`// Loaded from history: ${item.title}\nfunction example() {\n  return "This is a mock loaded state";\n}`);
        // setOutput(`### Historical Result\n\nThis is the cached output for the **${item.action}** action performed on ${item.time}.`);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans selection:bg-blue-200 overflow-hidden">

            {/* Global Minimal Header */}
            <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-slate-500 hover:text-slate-900"
                        title="Toggle Sidebar"
                    >
                        <PanelLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 font-bold tracking-tighter text-slate-900 border-l border-slate-200 pl-3">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <span>SleekReview <span className="hidden sm:inline font-normal text-slate-400 ml-1">Workspace</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden sm:flex text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span> Ready
                    </span>
                    <Button variant="ghost" size="sm" className="hidden sm:flex">Dashboard</Button>
                </div>
            </header>

            {/* Main App Container */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Subtle Background Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-50 -z-10 pointer-events-none" />

                {/* SIDEBAR: History / Searches */}
                <aside
                    className={`flex-shrink-0 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-10 ${isSidebarOpen ? 'w-64 md:w-72 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
                        }`}
                >
                    {/* Sidebar Header / Search */}
                    <div className="p-4 border-b border-slate-100 shrink-0">
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Review History</h2>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search history..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-8 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-shadow"
                            />
                        </div>
                    </div>

                    {/* Sidebar List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredHistory.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">
                                No history found.
                            </div>
                        ) : (
                            filteredHistory.map((item) => (
                                item.action &&
                                <button
                                    key={item._id}
                                    onClick={() => loadHistoryItem(item)}
                                    className={`w-full text-left px-3 py-2.5 rounded-md flex items-start gap-3 transition-colors group ${activeHistoryId === item.id
                                        ? 'bg-blue-50'
                                        : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <MessageSquare className={`h-4 w-4 mt-0.5 shrink-0 ${activeHistoryId === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${activeHistoryId === item.id ? 'text-blue-900' : 'text-slate-700'}`}>
                                            {item.title}
                                        </p>
                                        <div className="flex items-center text-xs mt-1 space-x-2">
                                            <span className={`truncate ${activeHistoryId === item.id ? 'text-blue-600' : 'text-slate-500'}`}>
                                                {item.action}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-400 flex items-center shrink-0">
                                                <Clock className="h-3 w-3 mr-1" /> {timeAgo(item.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* WORKSPACE: Split Layout (Code + AI) */}
                <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-w-0 relative">

                    {/* LEFT PANEL: Code Input */}
                    <section className="flex-1 flex flex-col border-r border-slate-200 min-w-0 lg:w-1/2 h-1/2 lg:h-full">
                        <div className="h-12 border-b border-slate-200 bg-slate-50/80 backdrop-blur flex items-center px-4 shrink-0">
                            <Code2 className="w-4 h-4 text-slate-500 mr-2" />
                            <h2 className="text-sm font-semibold text-slate-700">Code Input</h2>
                        </div>

                        <div className="flex-1 p-4 flex flex-col overflow-hidden">
                            <div className="flex-1 rounded-lg border border-slate-200 overflow-hidden bg-[#1e1e1e] shadow-inner flex flex-col">
                                <div className="h-8 bg-[#2d2d2d] flex items-center px-3 gap-1.5 shrink-0 border-b border-[#3d3d3d]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                    <span className="ml-2 text-xs text-slate-400 font-mono">editor.js</span>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        setActiveHistoryId(null); // Clear active history state if user edits
                                    }}
                                    placeholder="Paste your code here..."
                                    className="flex-1 w-full bg-transparent text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-0"
                                    spellCheck="false"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 pt-4 shrink-0">
                                <Button
                                    onClick={() => {
                                        handleAction('Review Code')
                                        handleReviewCode();
                                    }
                                    }
                                    disabled={isLoading || !code}
                                    className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                                >
                                    {activeAction === 'Review Code' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                                    Review
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAction('Explain Code')}
                                    disabled={isLoading || !code.trim()}
                                >
                                    {activeAction === 'Explain Code' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Sparkles className="w-4 h-4 mr-2 text-slate-500" />}
                                    Explain
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAction('Fix Bugs')}
                                    disabled={isLoading || !code.trim()}
                                >
                                    {activeAction === 'Fix Bugs' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Bug className="w-4 h-4 mr-2 text-slate-500" />}
                                    Fix Bugs
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAction('Optimize Code')}
                                    disabled={isLoading || !code.trim()}
                                >
                                    {activeAction === 'Optimize Code' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Zap className="w-4 h-4 mr-2 text-slate-500" />}
                                    Optimize
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT PANEL: AI Response */}
                    <section className="flex-1 flex flex-col bg-white min-w-0 lg:w-1/2 h-1/2 lg:h-full">
                        <div className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center">
                                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                                <h2 className="text-sm font-semibold text-slate-700">AI Review Output</h2>
                            </div>
                            {output && (
                                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
                                    {isCopied ? <Check className="w-4 h-4 text-green-600 mr-2" /> : <Copy className="w-4 h-4 text-slate-500 mr-2" />}
                                    {isCopied ? "Copied!" : "Copy"}
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
                            {!output && !isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 px-4 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                                        <ArrowRight className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">Workspace Ready</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Paste your code on the left and select an action to begin.</p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-4">
                                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm animate-pulse font-medium">Analyzing your code context...</p>
                                </div>
                            )}

                            {output && !isLoading && (
                                <div className="prose prose-slate prose-sm sm:prose-base max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 md:p-6 shadow-sm">
                                        <pre className="font-sans whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                                            {output}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

            </div>
        </div>
    );
}

export default Dashboard;





// --- Reused shadcn/ui Components ---

const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-slate-900 text-white hover:bg-slate-900/90 shadow-sm",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
        soft: "bg-blue-50 text-blue-700 hover:bg-blue-100", // Added for active sidebar items
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9", // Adjusted for header icons
    };
    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
};

// --- Mock History Data ---
// const MOCK_HISTORY = [
//     { id: 1, title: 'Auth Component Bug Fix', time: '10 mins ago', action: 'Fix Bugs' },
//     { id: 2, title: 'Data Sorting Algorithm', time: '2 hours ago', action: 'Optimize Code' },
//     { id: 3, title: 'React Navbar Review', time: 'Yesterday', action: 'Review Code' },
//     { id: 4, title: 'API Fetch Explanation', time: '2 days ago', action: 'Explain Code' },
//     { id: 5, title: 'Legacy User Model', time: 'Last week', action: 'Review Code' },
// ];

function timeAgo(timestamp) {
    console.log(timestamp)
    const now = new Date();
    const past = new Date(timestamp);

    const diffInSeconds = Math.floor((now - past) / 1000);

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;

    if (diffInSeconds < minute) {
        return `${diffInSeconds} sec ago`;
    }

    if (diffInSeconds < hour) {
        const mins = Math.floor(diffInSeconds / minute);
        return `${mins} min ago`;
    }

    if (diffInSeconds < day) {
        const hours = Math.floor(diffInSeconds / hour);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (diffInSeconds < 2 * day) {
        return "Yesterday";
    }

    if (diffInSeconds < week) {
        const days = Math.floor(diffInSeconds / day);
        return `${days} days ago`;
    }

    if (diffInSeconds < 2 * week) {
        return "Last week";
    }

    if (diffInSeconds < month) {
        const weeks = Math.floor(diffInSeconds / week);
        return `${weeks} weeks ago`;
    }

    if (diffInSeconds < 2 * month) {
        return "Last month";
    }

    const months = Math.floor(diffInSeconds / month);
    return `${months} months ago`;
}