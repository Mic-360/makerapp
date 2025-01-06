'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronDown, Mic } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageProps {
  content: string;
  sender: string;
  time: string;
  isUser?: boolean;
  isRead?: boolean;
}

const Message = ({ content, sender, time, isUser, isRead }: MessageProps) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    {!isUser && (
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage src="/placeholder.svg" alt={sender} />
        <AvatarFallback>SA</AvatarFallback>
      </Avatar>
    )}
    <div className="flex flex-col">
      <div
        className={`max-w-[70%] ${isUser ? 'bg-gray-700 text-white' : 'bg-[#F5F5F5]'} rounded-2xl p-4`}
      >
        <p className="text-sm">{content}</p>
      </div>
      <div className="flex items-center mt-1 text-xs text-gray-500">
        <span>{time}</span>
        {isUser && isRead && <span className="ml-2">Read by {sender}</span>}
      </div>
    </div>
  </div>
);

interface MessagePreviewProps {
  sender: string;
  message: string;
  time: string;
  isActive?: boolean;
}

const MessagePreview = ({
  sender,
  message,
  time,
  isActive = false,
}: MessagePreviewProps) => (
  <div
    className={`p-4 flex items-center gap-3 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'} cursor-pointer`}
  >
    <Avatar className="h-8 w-8">
      <AvatarImage src="/placeholder.svg" alt={sender} />
      <AvatarFallback>SA</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">{sender}</h4>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-500 truncate">{message}</p>
    </div>
  </div>
);

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(80vh-6.5rem)] gap-6">
      <Card className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Simran Aroa" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Simran Aroa</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-xs text-gray-500">
                We analyse messages for safety, support, product enhancement or
                other purposes.{' '}
                <a href="#" className="text-blue-600">
                  Learn more
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                To protect your payment, always communicate and pay through the
                ADBMS website or app.
              </p>
            </div>

            <Message
              content="Hi, My booking is for a 3-D Printer on 25th August? What all materials are available?"
              sender="Simran Aroa"
              time="5:45 PM"
            />
            <Message
              content="How long will it take for 4x4x4 cm print?"
              sender="Simran Aroa"
              time="5:45 PM"
            />
            <Message
              content="Yes, your booking is confirmed. We have PLA 2 cm wire. It will approximately take 2 hrs to print the entire design."
              sender="Support"
              time="5:30 PM"
              isUser={true}
              isRead={true}
            />
            <Message
              content="Okay, thank you for the information."
              sender="Simran Aroa"
              time="5:45 PM"
            />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <Input
              placeholder="Type your message here"
              className="flex-1 rounded-full border-gray-200"
            />
            <Button size="icon" variant="ghost" className="rounded-full">
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
      <Card className="w-1/4 flex flex-col bg-white rounded-2xl overflow-hidden">
        <div className="p-4 border-b">
          <Button
            variant="outline"
            className="w-full justify-between"
            size="sm"
          >
            All Messages
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <MessagePreview
            sender="Simran Aroa"
            message="Okay, thank you for the information."
            time="25 Aug"
            isActive
          />
          <MessagePreview
            sender="Karkhana Support"
            message="Okay, thank you for the information."
            time="23 Aug"
          />
        </ScrollArea>
      </Card>
    </div>
  );
}
