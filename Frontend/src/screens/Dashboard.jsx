import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/AxiosInstance';
import {
    Sparkles, Code2, Play, Bug, Zap, Copy, Check, Loader2, ArrowRight,
    PanelLeft, Search, Clock, MessageSquare, ChevronRight,
    TestTube, BrainCircuit
} from 'lucide-react';

// --- Main App Interface ---

const Dashboard = () => {
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null
    }); // Simulated logged-in user ID

    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeAction, setActiveAction] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [responses, setResponses] = useState({});
    const historyRef = useRef({});

    // New Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeHistoryId, setActiveHistoryId] = useState(null);

    const [MOCK_HISTORY, setMOCK_HISTORY] = useState([]);

    // FETCH USER HISTORY ON LOAD AND AFTER EACH REVIEW
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/ai/getHistory');
                setMOCK_HISTORY(res.data.responses);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };
        fetchHistory();
    }, []);

    // UPDATE HISTORY STATE AFTER REVIEW OR DOCUMENT UPDATE
    const updateHistoryState = (newData) => {
        setMOCK_HISTORY((prev) => {
            const exists = prev.find(
                (item) => item._id === newData._id
            );
            // Update existing document
            if (exists) {
                return prev.map((item) =>
                    item._id === newData._id
                        ? newData
                        : item
                );
            }
            // Add new document
            return [newData, ...prev];
        });
    };

    // UPDATE UI STATE WITH NEW RESPONSE
    const updateUI = (data) => {
        setResponses(data);
        setCode(data.prompt);
        setOutput(data.text);
        setIsLoading(false);

        updateHistoryState(data);
    };

    const normalizeString = (str) => {
        return str.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    // HANDLE HISTORY MODIFICATION - CHECK IF PROMPT HAS SIGNIFICANT CHANGES
    const handlehistoryModification = (oldPrompt, newPrompt) => {
        return normalizeString(oldPrompt) === normalizeString(newPrompt);
    };

    // HANDLE REVIEW CODE ACTION
    const handleReviewCode = async () => {
        try {
            setIsLoading(true);

            // Case 1: User is reviewing code for the first time
            if (!activeHistoryId) {
                const res = await axios.post('/ai/getAiResult', {
                    prompt: code,
                });

                updateUI(res.data.response);
                setActiveHistoryId(res.data.response._id);

                return;
            }

            // Case 2: User reopened an existing document
            const isSamePrompt = handlehistoryModification(
                responses.prompt,
                code
            );

            // Existing review is still valid
            if (isSamePrompt) {
                const res = await axios.post('/ai/getAiDocument', {
                    documentId: activeHistoryId,
                });

                updateUI(res.data.response);
                return;
            }

            // Case 3: User modified the code, generate a new review
            const res = await axios.post('/ai/getAiResult', {
                prompt: code,
            });

            updateUI(res.data.response);
            setActiveHistoryId(res.data.response._id);
        } catch (error) {
            console.error('Review Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredHistory = useMemo(() => {
        return MOCK_HISTORY.filter((item) =>
            item.title
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
            .sort(
                (a, b) =>
                    new Date(b.updatedAt) - new Date(a.updatedAt)
            );
    }, [MOCK_HISTORY, searchQuery])

    // HANDLE ACTION BUTTON CLICKS (EXPLAIN, FIX BUGS, OPTIMIZE)
    const handleAction = (actionName) => {
        if (!code.trim()) return;

        setIsLoading(true);
        setActiveAction(actionName);

        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            setOutput(responses.suggestions[actionName]);
        }, 200);
    };

    // HANDLE CODE COPY
    const handleCopy = () => {
        navigator.clipboard.writeText(responses.suggestions.optimizatedCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // HANDLE HISTORY ITEM CLICK
    const loadHistoryItem = async (item) => {
        setActiveHistoryId(item._id);

        if (historyRef.current[item._id]) {
            const data = historyRef.current[item._id];
            setResponses(data.response);
            setCode(data.response.prompt);
            setOutput(data.response.text);
            return;
        }

        const res = await axios.post('/ai/getAiDocument', { documentId: item._id });

        historyRef.current[item._id] = res.data;

        setResponses(res.data.response);
        setCode(res.data.response.prompt);
        setOutput(res.data.response.text);
        setIsLoading(false);
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
                        <Link to="/" className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <span>SleekReview </span>
                        </Link>
                        <span className="hidden sm:inline font-normal text-slate-400 ml-1">Workspace</span>
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
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-50 -z-10 pointer-events-none" />

                {/* SIDEBAR: History / Searches */}
                <aside
                    className={`shrink-0 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-10 ${isSidebarOpen ? 'w-64 md:w-72 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
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
                                    className={`w-full text-left px-3 py-2.5 cursor-pointer rounded-md flex items-start gap-3 transition-colors group ${activeHistoryId === item._id
                                        ? 'bg-blue-50'
                                        : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <MessageSquare className={`h-4 w-4 mt-0.5 shrink-0 ${activeHistoryId === item._id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${activeHistoryId === item._id ? 'text-blue-900' : 'text-slate-700'}`}>
                                            {item.title}
                                        </p>
                                        <div className="flex items-center text-xs mt-1 space-x-2">
                                            <span className={`truncate ${activeHistoryId === item._id ? 'text-blue-600' : 'text-slate-500'}`}>
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
                        <div className="h-12 border-b border-slate-200 bg-slate-50/80 backdrop-blur flex items-center justify-between px-4 shrink-0">
                            <div>
                                <Code2 className="w-4 h-4 text-slate-500 mr-2" />
                                <h2 className="text-sm font-semibold text-slate-700">Code Input</h2>
                            </div>
                            <Button
                                onClick={() => {
                                    // handleAction('reviewCode')
                                    handleReviewCode();
                                }
                                }
                                // disabled={isLoading || !code || !responses.suggestions?.reviewCode}
                                className="cursor-pointer"
                            >
                                {/* {activeAction === 'reviewCode' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />} */}
                                <BrainCircuit className="w-4 h-4 mr-2" />Analyze
                            </Button>
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
                                    variant="outline"
                                    onClick={() => {
                                        handleAction('reviewCode')
                                    }
                                    }
                                    disabled={isLoading || !code || !responses.suggestions?.reviewCode}
                                    className="cursor-pointer"
                                >
                                    {activeAction === 'reviewCode' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Play className="w-4 h-4 mr-2 text-slate-500" />}
                                    Review
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAction('explainCode')}
                                    disabled={isLoading || !code || !responses.suggestions?.explainCode}
                                    className="cursor-pointer"
                                >
                                    {activeAction === 'explainCode' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Sparkles className="w-4 h-4 mr-2 text-slate-500" />}
                                    Explain
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAction('fixBugs')}
                                    disabled={isLoading || !code || !responses.suggestions?.fixBugs}
                                    className="cursor-pointer"
                                >
                                    {activeAction === 'fixBugs' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Bug className="w-4 h-4 mr-2 text-slate-500" />}
                                    Fix Bugs
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleAction('optimization')}
                                    disabled={isLoading || !code || !responses.suggestions?.optimization}
                                    className="cursor-pointer"
                                >
                                    {activeAction === 'optimization' ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" /> : <Zap className="w-4 h-4 mr-2 text-slate-500" />}
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
                                    <p className="text-xs text-slate-400 mt-1 max-w-50">Paste your code on the left and select an action to begin.</p>
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
                                    <div className='pt-7' />
                                    {activeAction == 'optimization' &&
                                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 md:p-6 shadow-sm">
                                            <p className='pb-2'>Optiomized Code</p>
                                            <div className="flex-1 rounded-lg border border-slate-200 overflow-hidden bg-[#1e1e1e] shadow-inner flex flex-col">
                                                <div className="h-8 bg-[#2d2d2d] flex items-center px-3 gap-1.5 shrink-0 border-b border-[#3d3d3d]">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                                    <span className="ml-2 text-xs text-slate-400 font-mono">Review.js</span>
                                                </div>
                                                <textarea
                                                    value={responses.suggestions.optimizatedCode || ""}
                                                    readOnly
                                                    className="w-full min-h-25 h-auto bg-transparent text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-0 overflow-hidden"
                                                    spellCheck="false"
                                                />
                                            </div>
                                        </div>
                                    }
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
    // console.log(timestamp)
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