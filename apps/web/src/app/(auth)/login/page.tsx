'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth.store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/v1/auth/login', data);
      setAuth(res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } catch {
      setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-700">Quantus HR</h1>
        <p className="text-gray-500 mt-1">Sign in to your workspace</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input {...register('email')} type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@company.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input {...register('password')} type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="••••••••" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        {'root' in errors && errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 text-white rounded-lg py-2 font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        No account? <Link href="/register" className="text-brand-600 hover:underline">Register your organisation</Link>
      </p>
    </div>
  );
}
