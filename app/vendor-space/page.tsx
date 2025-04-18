import Footer from '@/components/footer';
import TopBar from '@/components/top-bar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const faqs = [
  {
    question: 'What are Real-Time Settlements?',
    preview:
      'Real-Time Settlement is one of the functions of payment service...',
    answer:
      'Real-Time Settlement is one of the functions of payment service providers that enables merchants to receive payments from their customers instantaneously into their bank account.',
  },
  {
    question: 'How does the payment process work?',
    preview: 'The payment process is secure and straightforward...',
    answer:
      'The payment process is secure and straightforward, involving multiple layers of verification and instant transfer capabilities. It ensures that funds are moved safely and quickly between accounts.',
  },
  {
    question: 'What kind of support do you offer?',
    preview: 'We offer 24/7 customer support through multiple channels...',
    answer:
      'We offer 24/7 customer support through multiple channels including chat, email, and phone. Our team is always ready to assist you with any queries, ensuring you have a smooth experience with our services.',
  },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar button={false} theme="light" />
      <main className="flex-grow">
        <section className="relative h-[600px] bg-[#1C1C1C] text-white flex items-center justify-center m-20 rounded-3xl overflow-hidden">
          <div className="flex flex-col items-center justify-center w-full h-full text-center relative">
            <Image
              src="/vendor-hero-bg.png"
              alt="Background"
              fill
              priority
              className="z-0 object-cover brightness-50"
            />
            <div className="relative z-10 max-w-3xl text-[#FEF996]">
              <h1 className="text-[72px] font-bold mb-32 leading-[1.33] tracking-[-0.01em]">
                Maximize your
                <br />
                Makerspace Potential
              </h1>
              <Link
                href="https://calendly.com/karkhanaclub/30min"
                className="text-2xl hover:text-white text-[#FEF996]"
              >
                Request for Demo now! &nbsp;&nbsp;&nbsp;→
              </Link>
            </div>
          </div>
        </section>

        <section className="my-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-[42px] font-bold text-center mb-8 leading-[1.26] tracking-[-0.02em] text-[#323232]">
            Be a part of India&apos;s
            <br />
            first maker-movement
          </h2>
          <div className="bg-white rounded-2xl max-w-5xl w-full mx-auto border shadow-xl  border-[#FE7A62]">
            <div className="flex items-center justify-between px-12 py-8 rounded-2xl hover:bg-[#D6D6D6] hover:shadow-xl text-[#323232] transition-transform duration-200 hover:scale-105">
              <h3 className="text-[35px] font-bold leading-[1.26] tracking-[-0.02em]">
                Rent Machines
              </h3>
              <p className="max-w-md text-2xl leading-[1.25]">
                Generate revenue by renting out underutilized machines to
                creators and hobbyists.
              </p>
            </div>
            <div className="flex items-center justify-between px-12 py-8 rounded-2xl text-[#323232] hover:shadow-xl hover:bg-[#D6D6D6] transition-transform duration-200 hover:scale-105">
              <h3 className="text-[35px] font-bold leading-[1.26] tracking-[-0.02em]">
                Host Events
              </h3>
              <p className="max-w-md text-2xl leading-[1.25]">
                Increase exposure and revenue by organizing workshops, meetups,
                and special events.
              </p>
            </div>
          </div>
        </section>

        <section className="my-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 max-w-md">
              <h2 className="text-[62px] font-bold mb-4 leading-[1.097] text-[#323232]">
                Offer a unique
                <br />
                hands-on learning
                <br />
                experience
              </h2>
              <p className="text-2xl leading-[1.417] text-[#323232]">
                By registering your makerspace on our platform, you can provide
                creators and hobbyists with access to cutting-edge tools,
                expert-led workshops, and a collaborative environment, enhancing
                their learning journey and skill development.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-8 grid grid-cols-2 gap-3">
              <div className="aspect-[5/6] rounded-3xl relative overflow-hidden">
                <Image
                  src="/vendor-bloc-u.png"
                  alt="Vendor Bloc U"
                  fill
                  className="rounded-3xl object-cover"
                />
              </div>
              <div className="aspect-[2] rounded-3xl"></div>
              <div className="aspect-[2] rounded-3xl"></div>
              <div className="aspect-[5/6] -mt-32 relative rounded-3xl overflow-hidden">
                <Image
                  src="/vendor-bloc-d.png"
                  alt="Vendor Bloc D"
                  fill
                  className="rounded-3xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-[#2C4ABE] text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              <h2 className="text-[54px] font-bold text-start col-span-2 pl-8 leading-[1.259]">
                Take a closer look →
              </h2>
              {[
                {
                  title: 'Event Listings',
                  description:
                    'List your events, workshops to attract more attendees, boost visibility, and foster community engagement.',
                },
                {
                  title: '24/7 Customer Support',
                  description:
                    'Get assistance anytime with round-the-clock customer support to resolve any issues or answer questions.',
                },
                {
                  title: 'Location-Based Search',
                  description:
                    'Powerful location-based search feature for easy navigation of the users.',
                },
                {
                  title: 'Reservation Screening',
                  description:
                    'Benefit from an advanced screening process that ensures reliable and serious bookings.',
                },
                {
                  title: 'Machine Inventory',
                  description:
                    'List your machines and equipment easy reservation and maximise utilisation of the makerspace.',
                },
                {
                  title: 'Maker Identity Verification',
                  description:
                    'Ensure a safe and trustworthy community with thorough identity checks for all users.',
                },
                {
                  title: 'Insurance Coverage',
                  description:
                    'Protect your machines with comprehensive insurance coverage for peace of mind.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="w-full h-44 flex flex-col justify-center rounded-xl bg-white p-4 hover:border-4 border-2 border-[#30C77B] shadow-[0px_7px_14px_0px_rgba(0,0,0,0.25)]"
                >
                  <h3 className="mb-2 text-[26px] font-medium leading-[1.192] text-[#323232]">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-[1.313] text-[#616161]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="my-44 px-8 text-center mx-auto max-w-4xl">
          <h2 className="text-[62px] font-bold mb-16 leading-[1.21] tracking-[-0.02em]">
            Become a part of the largest
            <br />
            network of Makerspaces
          </h2>
          <Link
            href="https://calendly.com/karkhanaclub/30min"
            className="inline-flex px-12 py-4 text-[28px] font-semibold text-white bg-[#1C1C1C] rounded-full hover:bg-gray-800 transition-colors"
          >
            Request a Demo
          </Link>
        </section>

        <section className="my-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto bg-gray-50/50 rounded-3xl p-8 md:p-10 border-[1.2px] border-[#2C4ABE]">
            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-10">
              <div className="md:w-2/5">
                <h2 className="text-[48px] font-bold leading-[1.208] text-[#2C4ABE]">
                  Some frequently
                  <br />
                  asked questions
                </h2>
              </div>
              <div className="md:w-2/5">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-[#D6D6D6]"
                    >
                      <AccordionTrigger className="text-[21px] font-bold text-start hover:no-underline text-[#323232]">
                        {faq.question}
                      </AccordionTrigger>
                      <div className="mb-4 -mt-2 text-base text-[#616161] tracking-[-0.01em]">
                        {faq.preview}
                      </div>
                      <AccordionContent className="text-base text-[#616161] tracking-[-0.01em] leading-[1.438] mb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Button
                  variant="link"
                  className="mt-24 text-lg p-0 h-auto font-normal text-[#888888] tracking-[-0.01em]"
                >
                  Read More →
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
