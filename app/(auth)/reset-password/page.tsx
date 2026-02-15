"use client";

import { useFormik } from "formik";
import { useState, Suspense } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordSchema } from "@/validation";
import { resetPassword } from "@/services/accounts";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Prefill valid initial values from URL if available, but let Formik manage them
    const initialValues = {
        email: searchParams.get("email") || "",
        code: searchParams.get("code") || "",
        password: "",
        confirmPassword: "",
    };

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: ResetPasswordSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await resetPassword({
                    email: values.email,
                    code: values.code,
                    password: values.password,
                    password_confirmation: values.confirmPassword
                });
                toast.success("Password reset successful! Please login.");
                router.push("/login");
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
                            &quot;A fresh start. <br />
                            Secure your harvest.&quot;
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
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">Reset Password</h1>
                        <p className="text-foreground/60">
                            Create a new secure password for your account.
                        </p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Email (Hidden or Readonly usually, but visible here so user can double check) */}
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
                                readOnly={!!searchParams.get("email")}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className={`w-full px-4 py-3 bg-white border ${formik.touched.email && formik.errors.email
                                    ? "border-red-500"
                                    : "border-secondary"
                                    } rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors read-only:bg-gray-50 read-only:text-gray-500`}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-xs text-red-500">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Code */}
                        <div className="space-y-2">
                            <label
                                htmlFor="code"
                                className="text-sm font-medium text-foreground/80 cursor-pointer"
                            >
                                Reset Code
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                readOnly={!!searchParams.get("code")}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.code}
                                className={`w-full px-4 py-3 bg-white border ${formik.touched.code && formik.errors.code
                                    ? "border-red-500"
                                    : "border-secondary"
                                    } rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors read-only:bg-gray-50 read-only:text-gray-500`}
                            />
                            {formik.touched.code && formik.errors.code && (
                                <p className="text-xs text-red-500">{formik.errors.code}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-foreground/80 cursor-pointer">
                                    New Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-xs text-primary hover:text-primary/80"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className={`w-full px-4 py-3 bg-white border ${formik.touched.password && formik.errors.password
                                    ? "border-red-500"
                                    : "border-secondary"
                                    } rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-xs text-red-500">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-foreground/80 cursor-pointer"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                                className={`w-full px-4 py-3 bg-white border ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-secondary"
                                    } rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <p className="text-xs text-red-500">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-foreground text-background hover:bg-primary hover:text-white font-medium rounded-sm transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="text-center text-sm text-foreground/60">
                        Back to{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}