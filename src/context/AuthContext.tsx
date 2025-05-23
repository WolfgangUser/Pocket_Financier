import { createContext, useReducer, useEffect, ReactNode } from 'react';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Create provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Store registered users
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : {};
  };

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Check demo account
      if (email === 'demo@example.com' && password === 'password') {
        const user = {
          id: 'demo',
          name: 'Demo User',
          email: 'demo@example.com',
          avatar: 'https://i.pravatar.cc/150?u=demo@example.com',
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN', payload: user });
        return;
      }

      // Check registered users
      const registeredUsers = getRegisteredUsers();
      const userRecord = registeredUsers[email];

      if (userRecord && userRecord.password === password) {
        const user = {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN', payload: user });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid email or password' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' });
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const registeredUsers = getRegisteredUsers();
      
      if (registeredUsers[email]) {
        dispatch({ type: 'SET_ERROR', payload: 'Email already registered' });
        return;
      }

      const userId = Date.now().toString();
      const newUser = {
        id: userId,
        name,
        email,
        password,
      };

      // Save to registered users
      registeredUsers[email] = newUser;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Create user session
      const user = {
        id: userId,
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Registration failed. Please try again.' 
      });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}