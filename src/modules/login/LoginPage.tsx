import { useState } from "react";
import {
  BG_IMAGE,
  LOGO_SVG,
  Field,
  PasswordField,
  PromoStats,
  SocialButtons,
} from "../auth/AuthUI";

export default function LoginPage({
  onNavigate,
}: {
  onNavigate: (p: "register" | "dashboard") => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Required.";
    if (!password) e.password = "Required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    // No backend yet — any valid-looking credentials sign the user in.
    if (validate()) onNavigate("dashboard");
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: "#0A0908" }}>
      {/* ── LEFT: Cinematic section ── */}
      <div className="relative hidden lg:flex lg:w-[60%] flex-col justify-end overflow-hidden">
        <img src={BG_IMAGE} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "#0A0908", opacity: 0.86 }} />
        <div className="absolute inset-0" style={{ background: "#49111C", opacity: 0.08 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,9,8,0.55) 100%)" }} />

        <div className="relative z-10 px-14 pb-16 max-w-[560px]">
          <p
            className="text-[11px] uppercase tracking-[0.22em] mb-6"
            style={{ color: "#A9927D", fontFamily: "var(--font-display)" }}
          >
            Premium Streaming
          </p>

          <div className="leading-none mb-6" style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
            <div className="text-[72px] xl:text-[80px] uppercase" style={{ color: "#F2F4F3" }}>WELCOME</div>
            <div className="text-[72px] xl:text-[80px] uppercase" style={{ color: "#A9927D" }}>BACK TO</div>
            <div className="text-[72px] xl:text-[80px] uppercase" style={{ color: "#F2F4F3" }}>YOUR</div>
            <div className="text-[72px] xl:text-[80px] uppercase" style={{ color: "#A9927D" }}>WORLD.</div>
          </div>

          <p className="text-sm leading-relaxed mb-10 max-w-[420px]" style={{ color: "#A9927D", fontFamily: "var(--font-body)" }}>
            Sign back in and pick up right where you left off — thousands of titles waiting for you.
          </p>

          <PromoStats />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px self-stretch" style={{ background: "rgba(94,80,63,0.2)" }} />

      {/* ── RIGHT: Login form ── */}
      <div className="flex-1 lg:w-[40%] flex flex-col overflow-y-auto" style={{ background: "#0A0908" }}>
        {/* Mobile background */}
        <div className="lg:hidden absolute inset-0 pointer-events-none">
          <img src={BG_IMAGE} alt="" aria-hidden className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0" style={{ background: "#0A0908", opacity: 0.88 }} />
        </div>

        <div className="relative z-10 flex flex-col h-full px-6 sm:px-10 xl:px-14 py-10">
          <div className="mb-10">{LOGO_SVG}</div>

          <div className="mb-8">
            <h1
              className="text-4xl sm:text-5xl xl:text-[52px] uppercase leading-none tracking-tight mb-2"
              style={{ color: "#F2F4F3", fontFamily: "var(--font-display)", fontWeight: 800 }}
            >
              Sign In
            </h1>
            <p className="text-sm" style={{ color: "#A9927D", fontFamily: "var(--font-body)" }}>
              Continue watching on{" "}
              <span className="font-semibold" style={{ color: "#F2F4F3" }}>STREAMFLIX</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Field label="Username or Email" placeholder="Enter your username or email" value={email} onChange={setEmail} error={errors.email} />
            <PasswordField label="Password" placeholder="Enter your password" value={password} onChange={setPassword} error={errors.password} />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 accent-[#49111C] rounded" />
                <span className="text-xs" style={{ color: "#A9927D", fontFamily: "var(--font-body)" }}>Remember me</span>
              </label>
              <button type="button" className="text-xs underline underline-offset-2 transition-colors hover:text-[#F2F4F3]" style={{ color: "#A9927D" }}>
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-bold uppercase tracking-[0.15em] transition-all duration-150 hover:bg-[#6b1927] active:scale-[0.99]"
              style={{ background: "#49111C", color: "#F2F4F3", fontFamily: "var(--font-display)" }}
            >
              Login
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(94,80,63,0.4)" }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "#5E503F", fontFamily: "var(--font-display)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(94,80,63,0.4)" }} />
          </div>

          <SocialButtons />

          <p className="mt-6 text-center text-sm" style={{ color: "#5E503F", fontFamily: "var(--font-body)" }}>
            {"Don't have an account? "}
            <button
              type="button"
              onClick={() => onNavigate("register")}
              className="transition-colors hover:text-[#F2F4F3]"
              style={{ color: "#A9927D" }}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
