import { create } from 'zustand';
import { reauthorizeUser } from './api';

interface CityState {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const useCityStore = create<CityState>((set) => ({
  selectedCity: 'Location',
  setSelectedCity: (city) => set({ selectedCity: city }),
}));

interface CategoryFilterState {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const useCategoryStore = create<CategoryFilterState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

interface AuthState {
  loginIdentifier: string;
  isValidEmail: boolean;
  isValidPhone: boolean;
  setLoginIdentifier: (identifier: string) => void;
  setIsValidEmail: (isValid: boolean) => void;
  setIsValidPhone: (isValid: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loginIdentifier: '',
  isValidEmail: false,
  isValidPhone: false,
  setLoginIdentifier: (identifier) => set({ loginIdentifier: identifier }),
  setIsValidEmail: (isValid) => set({ isValidEmail: isValid }),
  setIsValidPhone: (isValid) => set({ isValidPhone: isValid }),
}));

interface SignupStore {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
  userType: string;
  industry: string;
  purpose: string;
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setMobile: (mobile: string) => void;
  setUserType: (userType: string) => void;
  setIndustry: (industry: string) => void;
  setPurpose: (purpose: string) => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  userId: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  mobile: '',
  userType: '',
  industry: '',
  purpose: '',
  setUserId: (userId) => set({ userId }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setMobile: (mobile) => set({ mobile }),
  setUserType: (userType) => set({ userType }),
  setIndustry: (industry) => set({ industry }),
  setPurpose: (purpose) => set({ purpose }),
}));

interface CityDataState {
  machines: any[];
  events: any[];
  setMachines: (machines: any[]) => void;
  setEvents: (events: any[]) => void;
}

export const useCityDataStore = create<CityDataState>((set) => ({
  machines: loadCityState().machines,
  events: loadCityState().events,
  setMachines: (machines) => {
    set({ machines });
    if (typeof window !== 'undefined') {
      localStorage.setItem('cityMachines', JSON.stringify(machines));
    }
  },
  setEvents: (events) => {
    set({ events });
    if (typeof window !== 'undefined') {
      localStorage.setItem('cityEvents', JSON.stringify(events));
    }
  },
}));

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
}

interface AuthenticationState extends AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  reauth: () => Promise<void>;
  isLoading: boolean;
  otpTimer: number;
  setOtpTimer: (timer: number) => void;
}

// Load initial state from localStorage if available
const loadAuthState = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    return { user, token };
  } catch (error) {
    return { user: null, token: null };
  }
};

export const useAuthenticationStore = create<AuthenticationState>((set) => ({
  loginIdentifier: '',
  isValidEmail: false,
  isValidPhone: false,
  otpTimer: 45,
  isLoading: true,
  ...loadAuthState(),
  setLoginIdentifier: (identifier) => set({ loginIdentifier: identifier }),
  setIsValidEmail: (isValid) => set({ isValidEmail: isValid }),
  setIsValidPhone: (isValid) => set({ isValidPhone: isValid }),
  setOtpTimer: (timer) => set({ otpTimer: timer }),
  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  },
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  reauth: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null, token: null, isLoading: false });
        return;
      }

      const { user, token: newToken } = await reauthorizeUser(token);
      set({ user, token: newToken, isLoading: false });
    } catch (error) {
      set({ user: null, token: null, isLoading: false });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  },
}));
