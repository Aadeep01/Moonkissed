export default function HomePage() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Moonkissed
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Your cosmic blueprint, beautifully revealed
                </p>
                <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity">
                    Discover Your Chart
                </button>
            </div>
        </main>
    );
}
