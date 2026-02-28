import { Metadata } from "next";
import Link from "next/link";
import { LogOut, Package, Palette, LayoutDashboard } from "lucide-react";
import { logout } from "../login/actions";

export const metadata: Metadata = {
    title: "Admin Dashboard | AMOUREA",
    description: "Amourea internal management dashboard",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-forest text-cream flex flex-col fixed inset-y-0 shadow-xl z-10">
                <div className="p-6">
                    <h2 className="font-display font-bold text-2xl tracking-widest text-cream/90">AMOUREA</h2>
                    <p className="text-xs uppercase tracking-widest text-terracotta mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 font-body text-sm font-medium">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-forest-light transition-colors text-cream/80 hover:text-white"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-forest-light transition-colors text-cream/80 hover:text-white"
                    >
                        <Package className="w-5 h-5" />
                        Katalog Express
                    </Link>
                    <Link
                        href="/admin/builder"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-forest-light transition-colors text-cream/80 hover:text-white"
                    >
                        <Palette className="w-5 h-5" />
                        Opsi Rakit Sendiri
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-forest-light/30">
                    {/* Menggunakan Server Action di form button agar JS-less support works */}
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors font-body text-sm font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-h-screen">
                <div className="p-8 lg:p-12 font-body">
                    {children}
                </div>
            </main>
        </div>
    );
}
