import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
});

type AuthFormData = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  useEffect(() => {
    if (user) {
      navigate('/admin/blog');
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = isLogin 
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password);

      if (error) {
        let message = error.message;
        if (error.message.includes('Invalid login credentials')) {
          message = 'פרטי התחברות שגויים';
        } else if (error.message.includes('User already registered')) {
          message = 'משתמש כבר רשום עם כתובת אימייל זו';
        }
        toast({
          title: 'שגיאה',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: isLogin ? 'התחברת בהצלחה' : 'נרשמת בהצלחה',
          description: isLogin ? 'ברוכה הבאה!' : 'החשבון שלך נוצר בהצלחה',
        });
        navigate('/admin/blog');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>התחברות | סטודיו טופז</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">
              {isLogin ? 'התחברות' : 'הרשמה'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1"
                  dir="ltr"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">סיסמה</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="mt-1"
                  dir="ltr"
                />
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'מעבד...' : (isLogin ? 'התחבר' : 'הירשם')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-muted-foreground hover:text-foreground text-sm underline"
              >
                {isLogin ? 'אין לך חשבון? הירשם' : 'יש לך חשבון? התחבר'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
