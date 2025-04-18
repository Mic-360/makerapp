import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SocialIcon } from 'react-social-icons';
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
      <section className="bg-green-500 p-4 sm:p-8 xl:mx-20 mx-auto rounded-xl mb-8 sm:mb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">
              Join Karkhana Newsletter
            </h2>
            <p className="text-sm text-black">
              Get our weekly updates from the ecosystem of makers, innovation
              and technology. Join our newsletter now.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email address here"
              className="flex-grow rounded-r-none sm:rounded-r-none px-4 sm:px-6 placeholder:text-white mb-2 sm:mb-0"
            />
            <Button className="rounded-l-none sm:rounded-l-none bg-white text-black hover:bg-gray-800 hover:text-white px-4 sm:px-8 w-full sm:w-auto">
              Sign Up →
            </Button>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full lg:w-1/2">
            <div>
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <ul className="text-sm space-y-1">
                {['FAQ', 'Report Policy', 'Privacy Policy', 'T & C'].map(
                  (item) => (
                    <li key={item}>{item}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">About Us</h3>
              <ul className="text-sm space-y-1">
                <li>Learning</li>
                <li>In Press</li>
                <li>Blogs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Makerspaces</h3>
              <ul className="text-sm space-y-1">
                <li>Leadership</li>
                <li>Build a Makerspace</li>
              </ul>
            </div>
          </div>
          <div className="flex sm:flex-row justify-between items-center sm:items-start sm:gap-x-32 gap-x-4">
            <Button
              variant="secondary"
              className="rounded-lg px-8 py-6 bg-white text-black font-semibold text-xs w-full sm:w-auto"
            >
              List Your Machines
            </Button>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-2 text-start">Find us on</h3>
              <div className="flex justify-center sm:justify-start space-x-4">
                {[
                  {
                    name: 'facebook',
                    url: 'https://www.facebook.com/karkhanahub/',
                  },
                  { name: 'twitter', url: 'https://x.com/karkhanahub' },
                  {
                    name: 'instagram',
                    url: 'https://www.instagram.com/karkhanahub/',
                  },
                  {
                    name: 'youtube',
                    url: 'https://www.youtube.com/@karkhanahub',
                  },
                  {
                    name: 'linkedin',
                    url: 'https://www.linkedin.com/company/karkhanahub/',
                  },
                ].map((social) => (
                  <SocialIcon
                    key={social.name}
                    url={new URL(social.url).origin}
                  />
                  // <Link
                  //   key={social.name}
                  //   href={social.url}
                  //   className="text-gray-600 hover:text-gray-900"
                  // >
                  //   <span className="sr-only">{social.name}</span>
                  // </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center lg:justify-between items-center">
          <p className="text-sm text-gray-100">
            © karkhana 2024. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
