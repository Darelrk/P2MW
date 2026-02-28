import { login } from './actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream-light font-body relative z-50">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative z-10 border border-forest/10">
                <div className="text-center mb-10">
                    <h1 className="font-display text-4xl font-bold text-forest tracking-wider">AMOUREA</h1>
                    <p className="font-body text-sm text-terracotta tracking-widest uppercase mt-3 font-semibold">Authorized Personnel Only</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-forest/70 mb-2">Email Admin</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-forest/20 focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all outline-none bg-cream-dark/10"
                            placeholder="admin@amourea.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-forest/70 mb-2">Kata Sandi</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-forest/20 focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all outline-none bg-cream-dark/10"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            formAction={login}
                            className="w-full bg-forest text-cream font-bold tracking-widest py-4 rounded-xl shadow-lg hover:bg-forest-light hover:-translate-y-1 transition-all"
                        >
                            MASUK
                        </button>
                    </div>
                </form>
            </div>

            {/* Abstract Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blush/20 blur-3xl"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-sage/20 blur-3xl"></div>
            </div>
        </div>
    )
}
