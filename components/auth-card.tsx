import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function AuthCard({
  title,
  description,
  children,
  footerContent,
  onClose,
  className,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        'relative w-full max-w-lg z-10 mx-auto rounded-xl p-6',
        className
      )}
    >
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footerContent && (
        <CardFooter className="flex justify-center">{footerContent}</CardFooter>
      )}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
