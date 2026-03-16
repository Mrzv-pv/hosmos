"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // 1. Sign up
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Create company and link to profile
    if (data.user && company) {
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert({ name: company })
        .select()
        .single();

      if (!companyError && companyData) {
        await supabase
          .from("profiles")
          .update({ company_id: companyData.id, full_name: name })
          .eq("id", data.user.id);
      }
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-serif text-gray-900 mb-2">Check your email</h1>
          <p className="text-sm text-gray-500 mb-8">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/login">
            <Button className="w-full">
              Back to Login <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-serif text-2xl">Hosmos</span>
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-serif text-gray-900 mb-2 text-center">Start your free trial</h1>
          <p className="text-sm text-gray-500 mb-8 text-center">30 days free. No credit card required.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Work Email" type="email" placeholder="john@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Company Name" placeholder="Acme Manufacturing" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input label="Password" type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className="pt-2">
              <Button type="submit" className="w-full" loading={loading}>
                Create Account <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By creating an account, you agree to our Terms and Privacy Policy.
          </p>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-600 font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
