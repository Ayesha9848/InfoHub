import React, { useState, useEffect, useCallback } from 'react';

// --- MOCK BACKEND API SIMULATION ---
// These asynchronous functions simulate the network calls, latency,
// and structured data responses you would get from a deployed Node.js/Express backend.
// This allows the frontend logic to focus on API interaction, loading, and error handling.

const DELAY = 800; // Simulate network latency

const MOCK_QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is not the mountains ahead to climb that wear you out; it is the pebble in your shoe.", author: "Muhammad Ali" }
];

/**
 * Mocks the Weather API endpoint.
 * Handles simulated error for "ErrorCity".
 */
const fetchWeatherAPI = (city) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const cityLower = city.toLowerCase();

            if (cityLower === 'errorcity') {
                reject(new Error("City data is currently unavailable."));
                return;
            }

            // Mocked data based on a few known cities
            let data;
            if (cityLower.includes('hyderabad')) {
                data = { temperature: '28°C', condition: 'Sunny', wind: '10 km/h' };
            } else if (cityLower.includes('london')) {
                data = { temperature: '12°C', condition: 'Cloudy', wind: '15 km/h' };
            } else if (cityLower.includes('new york')) {
                data = { temperature: '18°C', condition: 'Clear Sky', wind: '8 km/h' };
            } else {
                // Default mock for unknown cities
                data = { temperature: ${Math.floor(Math.random() * 15) + 15}°C, condition: 'Partly Cloudy', wind: '7 km/h' };
            }

            resolve(data);
        }, DELAY);
    });
};

/**
 * Mocks the Currency Conversion API endpoint (INR to target).
 */
const convertCurrencyAPI = (amount, targetCurrency) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const amountNum = parseFloat(amount);

            if (isNaN(amountNum) || amountNum <= 0) {
                reject(new Error("Invalid amount entered. Please enter a positive number."));
                return;
            }

            const rates = {
                USD: 0.012, // 1 INR ≈ 0.012 USD
                EUR: 0.011, // 1 INR ≈ 0.011 EUR
            };

            const rate = rates[targetCurrency];
            if (!rate) {
                reject(new Error("Unsupported target currency."));
                return;
            }

            const result = (amountNum * rate).toFixed(2);
            resolve({
                originalAmount: amountNum,
                targetCurrency: targetCurrency,
                result: result,
                rate: rate
            });
        }, DELAY);
    });
};

/**
 * Mocks the Motivational Quote Generator API endpoint.
 */
const getQuoteAPI = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = Math.floor(Math.random() * MOCK_QUOTES.length);
            resolve(MOCK_QUOTES[index]);
        }, DELAY);
    });
};

// --- Icons (Inline SVG for reliability in single-file environment) ---

const Icon = ({ d, size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d={d} />
    </svg>
);

const CloudSun = (props) => <Icon {...props} d="M12 2v2M5.9 5.9l1.4 1.4M2 12h2M5.9 18.1l1.4-1.4M20 12h2M18.1 5.9l-1.4 1.4M12 22v-2M18.1 18.1l-1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4.5 12.5C2.1 12.5 0 11.4 0 10.5M24 10.5c0 .9-2.1 2-4.5 2" />;
const DollarSign = (props) => <Icon {...props} d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />;
const MessageSquare = (props) => <Icon {...props} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
const Loader = (props) => <Icon {...props} d="M21 12a9 9 0 1 1-6.219-8.56M12 2v10" className="animate-spin" />;

// --- Sub-Components for Modules ---

const WeatherModule = () => {
    const [city, setCity] = useState('Hyderabad');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = useCallback(async (searchCity) => {
        setLoading(true);
        setError(null);
        setWeather(null);
        try {
            const data = await fetchWeatherAPI(searchCity);
            setWeather(data);
        } catch (err) {
            setError(err.message || "Failed to fetch weather data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather('Hyderabad');
    }, [fetchWeather]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather(city.trim());
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <CloudSun size={20} className="mr-2 text-indigo-500" />
                Live Weather Update (Mocked)
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name (e.g., London)"
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? <Loader size={20} className="text-white mr-2" /> : 'Get Weather'}
                </button>
            </form>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                    <p className='text-sm mt-1 font-mono'>Try searching 'New York' or 'Hyderabad'</p>
                </div>
            )}

            {!loading && weather && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{city}</h3>
                    <p className="text-5xl font-extrabold text-indigo-600 mb-4">{weather.temperature}</p>
                    <div className="flex justify-between text-gray-600">
                        <p className="text-lg">Condition: <span className="font-medium text-gray-800">{weather.condition}</span></p>
                        <p className="text-lg">Wind Speed: <span className="font-medium text-gray-800">{weather.wind}</span></p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ConverterModule = () => {
    const [amount, setAmount] = useState('');
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConvert = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const conversion = await convertCurrencyAPI(amount, targetCurrency);
            setResult(conversion);
        } catch (err) {
            setError(err.message || "Conversion failed due to an API error.");
        } finally {
            setLoading(false);
        }
    }, [amount, targetCurrency]);

    useEffect(() => {
        if (amount) {
            // Auto-convert on amount change after a small delay
            const handler = setTimeout(() => {
                handleConvert();
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [amount, targetCurrency, handleConvert]);


    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <DollarSign size={20} className="mr-2 text-indigo-500" />
                Currency Converter (INR → USD/EUR)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="col-span-1">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount in INR</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g., 5000"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        disabled={loading}
                    />
                </div>
                <div className="col-span-1">
                    <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">To Currency</label>
                    <select
                        id="target"
                        value={targetCurrency}
                        onChange={(e) => setTargetCurrency(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white appearance-none"
                        disabled={loading}
                    >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                    </select>
                </div>
                <div className="col-span-1 flex items-end">
                    <button
                        onClick={handleConvert}
                        className="w-full h-[46px] px-6 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 flex items-center justify-center"
                        disabled={loading || !amount}
                    >
                        {loading ? <Loader size={20} className="text-white mr-2" /> : 'Convert'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {!loading && result && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <p className="text-gray-600 mb-2">Result for {result.originalAmount} INR:</p>
                    <p className="text-5xl font-extrabold text-green-600">
                        {result.result} <span className="text-3xl">{result.targetCurrency}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        (Mock Rate: 1 INR ≈ {result.rate} {result.targetCurrency})
                    </p>
                </div>
            )}
        </div>
    );
};

const QuoteModule = () => {
    const [quote, setQuote] = useState(MOCK_QUOTES[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuote = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const newQuote = await getQuoteAPI();
            setQuote(newQuote);
        } catch (err) {
            setError(err.message || "Failed to load quote.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleClick = () => {
        // Simple demonstration of error handling: 1 in 10 chance of API failure
        if (Math.random() < 0.1) {
            setError("The inspiration server is currently down. Please try again.");
            setQuote(null);
        } else {
            fetchQuote();
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <MessageSquare size={20} className="mr-2 text-indigo-500" />
                Motivational Quote Generator
            </h2>

            <button
                onClick={handleClick}
                className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-300 disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
            >
                {loading ? <Loader size={20} className="text-white mr-2" /> : 'Get Inspired'}
            </button>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {!loading && quote && (
                <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-purple-500 text-center relative">
                    <blockquote className="text-2xl italic text-gray-800 leading-relaxed">
                        &ldquo;{quote.text}&rdquo;
                    </blockquote>
                    <p className="mt-4 text-lg font-semibold text-purple-600">— {quote.author}</p>
                </div>
            )}
        </div>
    );
};


// --- Main App Component ---

const App = () => {
    const [activeTab, setActiveTab] = useState('weather'); // 'weather', 'converter', 'quotes'

    const renderModule = () => {
        switch (activeTab) {
            case 'weather':
                return <WeatherModule />;
            case 'converter':
                return <ConverterModule />;
            case 'quotes':
                return <QuoteModule />;
            default:
                return <WeatherModule />;
        }
    };

    const tabs = [
        { id: 'weather', name: 'Weather Info', icon: CloudSun },
        { id: 'converter', name: 'Currency Converter', icon: DollarSign },
        { id: 'quotes', name: 'Motivational Quotes', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>{`
                .font-sans { font-family: 'Inter', sans-serif; }
            `}</style>
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-10 bg-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-500">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">ByteXL InfoHub</h1>
                    <p className="text-gray-600">Your single-page utility center for engineering and life.</p>
                </header>

                {/* Navigation Tabs */}
                <nav className="mb-8 p-1 bg-white rounded-xl shadow-md flex justify-between sm:justify-center space-x-1 sm:space-x-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 sm:flex-none flex items-center justify-center sm:px-6 py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-inner shadow-indigo-800/50'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                                }
                            `}
                        >
                            <tab.icon size={20} className="mr-2 hidden sm:block" />
                            {tab.name}
                        </button>
                    ))}
                </nav>

                {/* Content Panel */}
                <main className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                    {renderModule()}
                </main>

                <footer className="text-center mt-10 text-gray-500 text-sm">
                    <p>&copy; 2024 InfoHub Challenge. All APIs are mocked for demonstration purposes.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
