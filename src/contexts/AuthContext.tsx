
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, users } from '../data/users';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${user.displayName}`
      });
      return true;
    }
    toast({
      variant: "destructive",
      title: "Error",
      description: "Invalid username or password"
    });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out"
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
