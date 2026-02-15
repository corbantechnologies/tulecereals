"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useFormik } from "formik";
import { LoginSchema } from "@/validation";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      const session = await getSession();

      setLoading(false);

      if (response?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful! Redirecting...");

        if (session?.user?.is_vendor === true) {
          router.push("/vendor/dashboard");
        } else if (session?.user?.is_customer === true) {
          router.push("/");
        } else if (session?.user?.is_superuser === true) {
          // TODO: Add superuser dashboard
          router.push("/vendor/dashboard");
        } else {
          router.push("/");
        }
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
              &quot;Fuel your day with <br />
              nature&apos;s goodness.&quot;
            </p>
            <p className="opacity-80 font-light">- The Tule Promise</p>
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
            <Link
              href="/"
              className="lg:hidden text-2xl font-serif font-bold text-foreground tracking-wide mb-8 block"
            >
              Tule Cereals
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">
              Welcome Back
            </h1>
            <p className="text-foreground/60">
              Please enter your details to access your account.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
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
                  autoComplete="email"
                  placeholder="name@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full px-4 py-3 bg-white border ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-secondary"} rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground/80 cursor-pointer"
                  >
                    Password
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full px-4 py-3 bg-white border ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-secondary"} rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors`}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CustomCheckbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/70 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-foreground text-background hover:bg-primary hover:text-white font-medium rounded-sm transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">Processing...</span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-foreground/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomCheckbox({ id }: { id: string }) {
  return (
    <Checkbox.Root
      className="shadow-sm hover:bg-secondary/20 flex h-4 w-4 appearance-none items-center justify-center rounded-[2px] border border-foreground/30 bg-white outline-none focus:ring-1 focus:ring-primary"
      id={id}
    >
      <Checkbox.Indicator className="text-primary">
        <Check className="h-3 w-3" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}
