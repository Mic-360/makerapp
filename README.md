# Karkhana MakerHub - A Next.js Maker Platform

Karkhana MakerHub is a web application built with Next.js, designed to connect makers, hobbyists, and professionals with makerspaces, machines, and events.  It provides a platform for:

*   **Discovering and Booking:**  Users can find makerspaces, explore available machines and events, and book them directly through the platform.
*   **Managing Makerspaces:**  Vendor accounts allow makerspace owners to manage their spaces, machines, events, memberships, and revenue.
*   **User Accounts:**  Individual users can create accounts, manage bookings, wishlists, and profiles.
*   **Secure Authentication:** Robust authentication flow using email/phone verification, password reset, and integration with third-party providers (Google, LinkedIn - placeholders currently).
*   **Responsive Design:** Built with Tailwind CSS and Radix UI components for a clean, responsive user interface.
*   **Payment processing.** Integrated payment options.

This project is a complete, full-stack application (though the backend is mock data within the frontend, it is structured to easily integrate with a real backend). It demonstrates a complex user flow, including onboarding, booking processes, profile management, and vendor dashboards.

## Tech Stack

*   **Frontend:**
    *   Next.js (React Framework)
    *   TypeScript
    *   Tailwind CSS (Utility-First CSS Framework)
    *   Radix UI (Headless UI Components)
    *   Zustand (State Management)
    *   Lucide React (Icon Library)
    *   next-auth (Authentication - placeholders for Google/LinkedIn)
    *   date-fns (Date Manipulation)
    *   class-variance-authority (Conditional Styling)
    *   clsx, tailwind-merge (Utility for merging Tailwind classes)

*   **Backend (Simulated - Ready for Integration):**
    *   API Routes in `lib/api.ts` are structured to be easily connected to a real backend (e.g., Node.js/Express, Python/Flask with a database like MongoDB).  The current implementation uses in-memory data.
    *   The `BASE_URL` constant is set up for easy switching to a production API.
    *   Authentication tokens are handled and stored using `localStorage`, mimicking a real-world scenario.

## Project Structure

The project follows a well-organized Next.js 13+ (App Router) structure:

*   **`app/`:**  The main application directory, containing all routes and layouts.
    *   **`auth/`:**  Handles all authentication-related pages (login, signup, password reset, etc.).  Each subfolder often represents a specific step in the auth flow.
    *   **`dashboard/`:**  The main dashboard area, accessible after login.  It's further divided into `(pages)` for specific dashboard sections (bookings, messages, etc.).
    *   **`home/`:**  The public-facing home page and related routes (e.g., booking pages for specific makerspaces, events).
    *   **`vendor-space/`:** Dedicated section for vendor accounts, including a dashboard for managing their spaces.  This is a crucial part demonstrating multi-user functionality.
    *   **`[name]/book`:** Dynamic route for booking a specific maker space.
    *   **`globals.css`:** Global styles, including Tailwind setup and custom CSS.
    *   **`layout.tsx`:** The root layout for the entire application.
    *   **`loading.tsx`:**  A loading component displayed during route transitions (using Suspense).
    *   **`page.tsx`:** The main entry point, initially handling city selection.
    *   **`user/page.tsx`**: User profile.
*   **`components/`:**  Reusable UI components.
    *   **`auth-provider.tsx`:**  Handles authentication logic, protecting routes, and managing user sessions.
    *   **`auth-card.tsx`:**  A styled card component used throughout the authentication flow.
    *   **`category-scroll.tsx`:**  A horizontal scrollable list of categories.
    *   **`filters.tsx`:**  A component for filtering machines/events.
    *   **`footer.tsx`:** The application footer.
    *   **`side-bar.tsx`**: Side bar component for dashboard.
    *   **`top-bar.tsx`:**  The application's top navigation bar, handling user login/logout, city selection, and search.
    *   **`ui/`:**  Reusable UI components from `shadcn/ui` (Radix UI + Tailwind CSS).  These provide accessible, unstyled building blocks.
*   **`lib/`:**  Utility functions and constants.
    *   **`api.ts`:**  Functions to interact with the (simulated) backend API.  This is where you'd integrate your actual API calls.
    *   **`constants.ts`:**  Constants like city names, categories, and sort options.
    *   **`store.ts`:**  State management using Zustand, handling global state like selected city, user authentication, and booking information.
    *   **`utils.ts`:**  Utility functions like `cn` (for conditional Tailwind classes) and `formatPrice`.
*   **`public/`:**  Static assets (images, icons, etc.).
*   **`next.config.mjs`:** Next.js configuration file.
*   **`package.json`:** Project dependencies and scripts.
*   **`postcss.config.js`**, **`tailwind.config.ts`:** Tailwind CSS configuration.
*   **`tsconfig.json`:** TypeScript configuration.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd makerapp
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # or
    npm install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Run the development server:**

    ```bash
    yarn dev
    # or
    npm run dev
    # or
    pnpm dev
    # or
    bun dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The project is set up for deployment on Vercel (as indicated by the `next/font` usage and the initial `create-next-app` setup).  You can easily deploy it by connecting your Vercel account to your Git repository.

## Key Features and Implementation Details

*   **Authentication:**  The `app/auth` directory contains a complete authentication flow, including:
    *   **Email/Phone Verification:**  The `verifyEmailOrPhone` function in `lib/api.ts` simulates checking for existing users.
    *   **Password Reset:**  A multi-step password reset flow is implemented, including sending a reset link (simulated), setting a new password, and confirmation.
    *   **Signup:** A multi-step signup process collects user information (name, email, phone, type, industry, purpose).
    *   **Login:** Uses email/phone and password.
    *   **Session Management:**  The `useAuthenticationStore` hook uses `localStorage` to persist user and token information.  This is a good starting point, but for production, you'd likely want to use HTTP-only cookies or a more secure approach.
    *   **Reauthorization:** The `reauth` function in `lib/api.ts` and the `reauth` function in `useAuthenticationStore` is setup to refresh a user's authentication token, preventing session expiration.
    *   **`AuthProvider` Component:** This crucial component wraps the entire application (`app/layout.tsx`).  It:
        *   Checks for a valid token on initial load and reauthorizes the user.
        *   Sets up a periodic reauthorization check.
        *   Handles redirects based on authentication status (e.g., redirecting to login if accessing a protected route without being logged in).

*   **Dynamic Routes:**  The project uses Next.js's dynamic routes extensively:
    *   `app/home/[name]/book/page.tsx`:  The booking page for a specific makerspace (identified by `name`).
    *   `app/vendor-space/[id]/dashboard/page.tsx`:  The vendor dashboard, with `[id]` representing the makerspace ID.  This is a crucial part of the vendor-specific functionality.  The various dashboard pages are nested within this route.

*   **State Management (Zustand):** Several Zustand stores are used to manage global state:
    *   `useCityStore`:  Stores the currently selected city.
    *   `useCategoryStore`: Stores the currently selected category (for filtering).
    *   `useAuthenticationStore`:  Manages user authentication state (user data, token, login status).
    *   `useSignupStore`:  Handles the multi-step signup process.
    *   `useCityDataStore`:  Stores fetched data related to the selected city (machines, events).
    *   `useBookingStore`: Manages the booking cart/process.

*   **API Interactions (Simulated):**
    *   The `lib/api.ts` file contains functions that simulate API calls.  These functions are well-organized and clearly demonstrate how you would interact with a real backend.
    *   Functions are provided for fetching machines, events, makerspaces, user authentication, password reset, and more.
    *   The `BASE_URL` constant is set to `http://localhost:8080`, making it easy to switch to a production API.

*   **UI Components (Radix UI + Tailwind CSS):**  The project makes excellent use of Radix UI (via `shadcn/ui`) for accessible, unstyled components, combined with Tailwind CSS for styling.  This results in a clean, consistent, and easily customizable UI.
    *   Components like `Button`, `Input`, `Select`, `Dialog`, `Accordion`, `Tabs`, etc., are used extensively.
    *   The `cn` utility function (from `clsx` and `tailwind-merge`) is used for conditionally applying Tailwind classes.

*   **Vendor Dashboard:** The `app/vendor-space` directory contains a fully functional vendor dashboard, allowing makerspace owners to:
    *   Manage their space details (basic info, location, amenities, etc.).
    *   Add, edit, and delete machines and events.
    *   View bookings and messages (placeholders for data, but the UI is set up).
    *   Monitor revenue (placeholder data).
    *   Manage memberships (placeholder data, but UI is built).

*   **Booking Flow:**  A well-defined booking flow is implemented:
    *   Users can browse machines and events, filter them, and view details.
    *   They can select quantities, dates, and times.
    *   A "Request to Book" button (simulated) leads to a payment page (also simulated).
    *   The booking state is managed through the `useBookingStore`.

*   **Onboarding:** The `/home/onboarding` route provides a welcome screen that automatically redirects to the main home page after a delay.

*   **Error Handling:** Basic error handling is present in the API functions and UI components (e.g., displaying error messages).

*   **Loading States:** Loading indicators are used in several places (e.g., during API calls, route transitions) to improve the user experience.

*   **Responsiveness:** The application is designed to be responsive, adapting to different screen sizes.

*   **TypeScript:** The entire project is written in TypeScript, providing type safety and improved code maintainability.

*   **ESLint and Prettier:** Configured for code linting and formatting.

* **Image Handling**: Handles local images, and placeholders for remote images are setup.

## Improvements and Next Steps

This project is very well-structured and demonstrates a strong understanding of Next.js and related technologies. Here are some suggestions for improvements and next steps:

*   **Backend Integration:**  This is the most crucial next step.  Replace the simulated API calls in `lib/api.ts` with real API calls to a backend server (e.g., Node.js/Express, Python/Flask, or a serverless backend).  You'll need to implement:
    *   Database interactions (MongoDB is a good choice).
    *   Authentication (JWT or similar).
    *   Authorization (role-based access control, e.g., vendors can only access their own makerspace data).
    *   Image upload and storage (e.g., AWS S3, Cloudinary, Firebase Storage).
    *   Real payment gateway integration (Stripe, Razorpay, etc.).

*   **Enhanced Error Handling:** Implement more robust error handling throughout the application.  Display user-friendly error messages and handle edge cases gracefully.

*   **Testing:**  Add unit tests and integration tests to ensure the application's reliability.  Jest and React Testing Library are good choices.

*   **Accessibility:**  Further improve accessibility by adding ARIA attributes, keyboard navigation, and screen reader testing. Radix UI provides a good foundation, but you should always double-check.

*   **SEO Optimization:**  Add relevant metadata (titles, descriptions) to each page to improve search engine optimization.

*   **Performance Optimization:**
    *   Optimize images for faster loading.
    *   Consider using Next.js's `Image` component with proper optimization.
    *   Implement code splitting and lazy loading where appropriate.
    *   Use server-side rendering (SSR) or static site generation (SSG) where possible.

*   **Real-time Updates:**  For features like messaging and booking updates, consider using WebSockets (e.g., Socket.IO) or Server-Sent Events (SSE) for real-time communication.

*   **User Roles and Permissions:** Implement a more robust role-based access control system.  Currently, the vendor functionality is separate, but you'll likely need finer-grained control over permissions within the vendor dashboard.

* **More detailed machine/event information**: Adding more detailed machine and event information.

*   **Internationalization (i18n):**  If you plan to support multiple languages, integrate a library like `next-i18next`.

*   **Deployment:** Deploy to Vercel, Netlify, or another hosting platform.

*   **User Profile:**  Expand the user profile functionality to allow users to manage their information, bookings, and reviews.

* **Reviews and Ratings:** Implement functionality for user to add, edit and delete reviews and ratings.

This is a very solid foundation.  By addressing these improvements, you'll have a production-ready application.
