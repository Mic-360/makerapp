import { create } from 'zustand';
import { reauthorizeUser } from './api';

interface CityState {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

// Load initial city state from localStorage
const loadCityState = () => {
  if (typeof window === 'undefined') return { selectedCity: 'Location' };
  try {
    const city = localStorage.getItem('selectedCity') || 'Location';
    return { selectedCity: city };
  } catch (error) {
    return { selectedCity: 'Location' };
  }
};

export const useCityStore = create<CityState>((set) => ({
  selectedCity: loadCityState().selectedCity,
  setSelectedCity: (city) => {
    set({ selectedCity: city });
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCity', city);
    }
  },
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
  userType: string[];
  industry: string[];  // Changed from string to string[]
  purpose: string[];
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setMobile: (mobile: string) => void;
  setUserType: (userType: string) => void;
  addUserType: (type: string) => void;
  removeUserType: (type: string) => void;
  setIndustry: (industry: string[]) => void;
  addIndustry: (industry: string) => void;
  removeIndustry: (industry: string) => void;
  setPurpose: (purpose: string) => void;
  addPurpose: (purpose: string) => void;
  removePurpose: (purpose: string) => void;
}

export const useSignupStore = create<SignupStore>((set) => ({
  userId: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  mobile: '',
  userType: [],
  industry: [],  // Changed from '' to []
  purpose: [],
  setUserId: (userId) => set({ userId }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setMobile: (mobile) => set({ mobile }),
  setUserType: (userType) => set({ userType: [userType] }),
  addUserType: (type) => set((state) => {
    if (state.userType.length < 2 && !state.userType.includes(type)) {
      return { userType: [...state.userType, type] };
    }
    return state;
  }),
  removeUserType: (type) => set((state) => ({
    userType: state.userType.filter((t) => t !== type)
  })),
  setIndustry: (industry) => set({ industry }),
  addIndustry: (industry) => set((state) => {
    if (state.industry.length < 3 && !state.industry.includes(industry)) {
      return { industry: [...state.industry, industry] };
    }
    return state;
  }),
  removeIndustry: (industry) => set((state) => ({
    industry: state.industry.filter((i) => i !== industry)
  })),
  setPurpose: (purpose) => set({ purpose: [purpose] }),
  addPurpose: (purpose) => set((state) => {
    if (state.purpose.length < 3 && !state.purpose.includes(purpose)) {
      return { purpose: [...state.purpose, purpose] };
    }
    return state;
  }),
  removePurpose: (purpose) => set((state) => ({
    purpose: state.purpose.filter((p) => p !== purpose)
  })),
}));

interface CityDataState {
  machines: any[];
  events: any[];
  setMachines: (machines: any[]) => void;
  setEvents: (events: any[]) => void;
}

export const useCityDataStore = create<CityDataState>((set) => ({
  machines: [],
  events: [],
  setMachines: (machines) => set({ machines }),
  setEvents: (events) => set({ events }),
}));

interface User {
  _id: string;
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
  login: (user: User, token: string) => void;
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
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
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
  login: (user, token) => {
    set({ user, token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
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

interface BookingItem {
  type: 'machine' | 'event';
  id: string;
  name: string;
  price: number;
  quantity: number;
  specifications?: {
    [key: string]: string;
  };
  imageUrl?: string;
  location: string;
  timeSlot: {
    start: string;
    end: string;
  };
  date?: {
    start: string;
    end: string;
  };
  inCharge?: Array<{
    name: string;
    number: string;
  }>;
  experts?: Array<{
    name: string;
    number: string;
  }>;
  makerSpace: string;
}

interface BookingState {
  items: BookingItem[];
  date?: Date;
  timeSlot?: string;
  addItem: (item: Omit<BookingItem, 'quantity'>, quantity: number) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  setDate: (date: Date) => void;
  setTimeSlot: (timeSlot: string) => void;
  getTotal: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  items: [],
  date: undefined,
  timeSlot: undefined,
  addItem: (item, quantity) => set((state) => {
    const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
    if (existingItemIndex > -1) {
      const newItems = [...state.items];
      newItems[existingItemIndex] = { ...newItems[existingItemIndex], quantity };
      return { items: newItems };
    }
    return { items: [...state.items, { ...item, quantity }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  clearItems: () => set({ items: [] }),
  setDate: (date) => set({ date }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
