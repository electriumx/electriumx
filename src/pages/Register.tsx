
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addUser } from '../data/users';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Apple, Facebook } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', name: '' });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = { email: '', password: '', name: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newUser = {
        username: email.toLowerCase(),
        password: password,
        displayName: name
      };

      try {
        addUser(newUser);
        // Automatically log in after successful registration
        if (login(newUser.username, newUser.password)) {
          toast({
            title: "Welcome!",
            description: "Your account has been created and you're now signed in.",
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Please try again with different credentials.",
        });
      }
    }
  };

  const handleSocialRegister = (provider: string) => {
    // In a real app, we would implement OAuth registration here
    // For now, we'll just create and log in as a demo user
    const demoUser = {
      username: `demo_${Date.now()}`,
      password: 'demo123',
      displayName: `Demo User (${provider})`
    };
    
    try {
      addUser(demoUser);
      if (login(demoUser.username, demoUser.password)) {
        toast({
          title: "Welcome!",
          description: "Your account has been created with " + provider,
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-center text-3xl font-bold">Create your account</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleSocialRegister('Google')}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleSocialRegister('Facebook')}
          >
            <Facebook className="h-5 w-5 mr-2 text-blue-600" />
            Facebook
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleSocialRegister('Apple')}
          >
            <Apple className="h-5 w-5 mr-2" />
            Apple
          </Button>
        </div>
        
        <div className="flex items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-4 text-sm text-muted-foreground">or continue with</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create account
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-primary hover:text-primary/90">
            Already have an account? Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
