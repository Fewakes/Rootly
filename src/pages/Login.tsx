import { LoginForm } from '@/features/auth/login-form';
import { supabase } from '@/lib/supabaseClient';
import { GalleryVerticalEnd } from 'lucide-react';

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback',
      },
    });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-primaryBlue p-10 min-h-screen">
        <h1
          className="text-white font-pacifico whitespace-nowrap leading-[1.1] mb-0"
          style={{ fontSize: 'clamp(7rem, 18vw, 11rem)' }}
        >
          Rootly
        </h1>

        <div
          className="text-white text-right text-[0.9rem] mt-[0.2em] whitespace-nowrap select-none"
          style={{ maxWidth: '26ch' }}
        >
          Where connections grow into opportunities
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Start your journey with Rootly
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm handleLogin={handleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
