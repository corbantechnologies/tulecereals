"use client";

import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { ForgotPasswordSchema } from "@/validation";
import { forgotPassword } from "@/services/accounts";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: ForgotPasswordSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await forgotPassword(values);
                toast.success("Reset link sent! Please check your email.");
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex w-full bg-background">
            {/* Left Column - Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-secondary/20">
                <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 flex flex-col justify-between p-12 z-20">
                    <div className="text-2xl font-serif font-bold text-white tracking-wide">
                        Tule Cereals
                    </div>
                    <div className="text-white">
                        <p className="text-3xl font-serif leading-tight mb-4">
                            &quot;Recover access <br />to your wholesome pantry.&quot;
                        </p>
                    </div>
                </div>
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/login-bg.svg"
                        alt="Background Texture"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 animate-in fade-in slide-in-from-right-10 duration-500">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="lg:hidden text-2xl font-serif font-bold text-foreground tracking-wide mb-8 block">
                            Tule Cereals
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">Forgot Password?</h1>
                        <p className="text-foreground/60">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-foreground/80 cursor-pointer"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className={`w-full px-4 py-3 bg-white border ${formik.touched.email && formik.errors.email
                                    ? "border-red-500"
                                    : "border-secondary"
                                    } rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-xs text-red-500">{formik.errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-foreground text-background hover:bg-primary hover:text-white font-medium rounded-sm transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="text-center text-sm text-foreground/60">
                        Remember your password?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}