"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlanetIcon } from "@/components/ui/PlanetIcon";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Full page navigation so the server/middleware sees the new auth cookie
    window.location.href = redirectTo;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
              <PlanetIcon size={32} />
            </div>
            <span className="font-serif text-2xl">Hosmos</span>
          </Link>

          <h1 className="text-3xl font-serif text-gray-900 mb-2">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">Log in to your ESG dashboard</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Log in <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:text-blue-600 font-semibold">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-500 to-violet-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-serif mb-6">ESG compliance made simple</h2>
          <div className="space-y-4">
            {[
              "Scope 1/2/3 carbon calculation",
              "100+ ESG parameters",
              "CSRD / GRI / CDP reports",
              "Onboarding in 30 minutes",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={12} />
                </div>
                <span className="text-sm font-light">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
            <p className="text-sm font-light italic">
              &ldquo;Hosmos helped us get CSRD-ready in 2 weeks. Our clients now trust our ESG data.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full" />
              <div>
                <p className="text-sm font-semibold">Maria K.</p>
                <p className="text-xs opacity-70">Procurement Manager, 120 employees</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
