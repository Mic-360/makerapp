'use client';

import { Button } from '@/components/ui/button';
import { categories } from '@/lib/constants';
import { useCategoryStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function CategoryScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="relative max-w-full mb-8">
      {/* {selectedCategory && (
        <div className="mb-4 flex items-center">
          <span className="text-sm mr-2">Filtered by:</span>
          <div className="bg-black text-white rounded-full py-1 px-3 text-xs flex items-center">
            {selectedCategory}
            <button onClick={clearCategory} className="ml-2 focus:outline-none">
              <X size={14} />
            </button>
          </div>
        </div>
      )} */}
      {showLeftButton && (
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide py-4"
        onScroll={checkScroll}
      >
        {categories.map((category, index) => (
          <Button
            key={index}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className={`whitespace-nowrap px-10 py-6 rounded-xl font-semibold ${
              selectedCategory === category
                ? 'bg-green-500 text-white hover:bg-green-400'
                : 'hover:bg-green-500 hover:text-white'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      {showRightButton && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
