"use client";

import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SignupSchema } from "@/validation";
import { signupCustomer } from "@/services/accounts";

export default function SignupCustomer() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // States to manage password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            password_confirmation: "",
            first_name: "",
            last_name: "",
            country: "",
            phone_number: "",
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await signupCustomer({
                    ...values,
                    phone_number: values.phone_number || null,
                });
                toast.success("Account created successfully! Please login.");
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
                    <Link href="/" className="text-2xl font-serif font-bold text-white tracking-wide">
                        Tule Cereals
                    </Link>
                    <div className="text-white">
                        <p className="text-3xl font-serif leading-tight mb-4">
                            &quot;Join our community of <br />
                            healthy living enthusiasts.&quot;
                        </p>
                        <p className="opacity-80 font-light">- Unlock Exclusive Harvests</p>
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 animate-in fade-in slide-in-from-right-10 duration-500 overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-auto">
                    <div className="text-center lg:text-left">
                        <Link
                            href="/"
                            className="lg:hidden text-2xl font-serif font-bold text-foreground tracking-wide mb-8 block"
                        >
                            Tule Cereals
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
                            Create Account
                        </h1>
                        <p className="text-foreground/60">
                            Sign up to start your journey with us.
                        </p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="first_name"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                                >
                                    First Name
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    placeholder="Jane"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.first_name}
                                    className={`w-full px-4 py-2.5 text-sm bg-white border ${
                                        formik.touched.first_name && formik.errors.first_name
                                            ? "border-red-500 focus:ring-red-500/20"
                                            : "border-secondary focus:ring-primary/20 focus:border-primary"
                                    } rounded-md focus:outline-none focus:ring-2 transition-all`}
                                />
                                {formik.touched.first_name && formik.errors.first_name && (
                                    <p className="text-xs text-red-500">{formik.errors.first_name}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="last_name"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    placeholder="Doe"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.last_name}
                                    className={`w-full px-4 py-2.5 text-sm bg-white border ${
                                        formik.touched.last_name && formik.errors.last_name
                                            ? "border-red-500 focus:ring-red-500/20"
                                            : "border-secondary focus:ring-primary/20 focus:border-primary"
                                    } rounded-md focus:outline-none focus:ring-2 transition-all`}
                                />
                                {formik.touched.last_name && formik.errors.last_name && (
                                    <p className="text-xs text-red-500">{formik.errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="jane.doe@example.com"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className={`w-full px-4 py-2.5 text-sm bg-white border ${
                                    formik.touched.email && formik.errors.email
                                        ? "border-red-500 focus:ring-red-500/20"
                                        : "border-secondary focus:ring-primary/20 focus:border-primary"
                                } rounded-md focus:outline-none focus:ring-2 transition-all`}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-xs text-red-500">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="phone_number"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                            >
                                Phone Number
                            </label>
                            <input
                                id="phone_number"
                                name="phone_number"
                                type="text"
                                placeholder="+254712300000"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone_number}
                                className={`w-full px-4 py-2.5 text-sm bg-white border ${
                                    formik.touched.phone_number && formik.errors.phone_number
                                        ? "border-red-500 focus:ring-red-500/20"
                                        : "border-secondary focus:ring-primary/20 focus:border-primary"
                                } rounded-md focus:outline-none focus:ring-2 transition-all`}
                            />
                            {formik.touched.phone_number && formik.errors.phone_number && (
                                <p className="text-xs text-red-500">{formik.errors.phone_number}</p>
                            )}
                        </div>

                        {/* Country */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="country"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                            >
                                Country
                            </label>
                            <input
                                id="country"
                                name="country"
                                type="text"
                                placeholder="Kenya"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.country}
                                className={`w-full px-4 py-2.5 text-sm bg-white border ${
                                    formik.touched.country && formik.errors.country
                                        ? "border-red-500 focus:ring-red-500/20"
                                        : "border-secondary focus:ring-primary/20 focus:border-primary"
                                } rounded-md focus:outline-none focus:ring-2 transition-all`}
                            />
                            {formik.touched.country && formik.errors.country && (
                                <p className="text-xs text-red-500">{formik.errors.country}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    className={`w-full pl-4 pr-11 py-2.5 text-sm bg-white border ${
                                        formik.touched.password && formik.errors.password
                                            ? "border-red-500 focus:ring-red-500/20"
                                            : "border-secondary focus:ring-primary/20 focus:border-primary"
                                    } rounded-md focus:outline-none focus:ring-2 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground transition-colors focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-xs text-red-500">{formik.errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="password_confirmation"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password_confirmation}
                                    className={`w-full pl-4 pr-11 py-2.5 text-sm bg-white border ${
                                        formik.touched.password_confirmation && formik.errors.password_confirmation
                                            ? "border-red-500 focus:ring-red-500/20"
                                            : "border-secondary focus:ring-primary/20 focus:border-primary"
                                    } rounded-md focus:outline-none focus:ring-2 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground transition-colors focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                                <p className="text-xs text-red-500">{formik.errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-foreground text-background hover:bg-primary hover:text-white font-medium rounded-md transition-all duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <div className="text-center text-sm text-foreground/60">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}