import { supabase } from '../lib/supabaseClient';
import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import loginImage from '../assets/LoginLogo.png';

// Initial Login page
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={loginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Rootly
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
// return (
//   <div className="p-8">
//     <h1 className="text-2xl font-bold">Login</h1>
//     <button
//       onClick={handleLogin}
//       className="mt-4 bg-black text-white px-4 py-2 rounded"
//     >
//       Sign in with Google
//     </button>
//   </div>
// );
