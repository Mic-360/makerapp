'use client';

import { useState } from 'react';
import { X, Info, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

const brands = [
  { id: 'formlabs', label: 'Formlabs' },
  { id: 'ultimaker', label: 'UltiMaker' },
  { id: 'creality', label: 'Creality' },
  { id: 'flashforge', label: 'FlashForge' },
  { id: 'craftbot', label: 'CraftBot' },
  { id: 'prusa', label: 'Prusa' },
  { id: 'makerbot', label: 'MakerBot' },
  { id: 'elegoo', label: 'Elegoo' },
  { id: 'bambulab', label: 'Bambu Lab' },
];

export function Filters({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['ultimaker']);
  const [dimensions, setDimensions] = useState({ x: '00', y: '00', z: '00' });
  const [nozzleSize, setNozzleSize] = useState([1]);
  const [priceRange, setPriceRange] = useState([500]);
  const [showMore, setShowMore] = useState(false);

  if (!isOpen) return null;

  const displayedBrands = showMore ? brands : brands.slice(0, 6);

  return (
    <div className="-mt-12">
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <span className="font-medium">Filters</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="bg-white backdrop-blur-sm border rounded-xl">
        <div className="rounded-t-xl bg-background">
          <div className=" overflow-y-auto scrollbar-hide">
            <div className="space-y-6 p-4">
              {/* Brands */}
              <div className="space-y-4">
                <h3 className="font-medium">Brands</h3>
                <div className="grid grid-cols-2 gap-4">
                  {displayedBrands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand.id}
                        checked={selectedBrands.includes(brand.id)}
                        className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 data-[state=checked]:bg-orange-500"
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBrands([...selectedBrands, brand.id]);
                          } else {
                            setSelectedBrands(
                              selectedBrands.filter((id) => id !== brand.id)
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={brand.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand.label}
                      </label>
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="px-0 text-sm"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'Show less' : 'Show more'}
                </Button>
              </div>

              {/* Filament Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Filament Type</h3>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Select defaultValue="pla">
                  <SelectTrigger>
                    <SelectValue placeholder="Select filament type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pla">PLA</SelectItem>
                    <SelectItem value="abs">ABS</SelectItem>
                    <SelectItem value="petg">PETG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dimension */}
              <div className="space-y-4">
                <h3 className="font-medium">Dimension</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={dimensions.x}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, x: e.target.value })
                    }
                    className="w-16"
                  />
                  <span>×</span>
                  <Input
                    type="text"
                    value={dimensions.y}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, y: e.target.value })
                    }
                    className="w-16"
                  />
                  <span>×</span>
                  <Input
                    type="text"
                    value={dimensions.z}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, z: e.target.value })
                    }
                    className="w-16"
                  />
                  <span className="text-sm text-muted-foreground">cm</span>
                </div>
              </div>

              {/* Nozzle Size */}
              <div className="space-y-4">
                <h3 className="font-medium">Nozzle Size</h3>
                <div className="space-y-4">
                  <Slider
                    value={nozzleSize}
                    onValueChange={setNozzleSize}
                    min={0.1}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      0.1 mm
                    </span>
                    <span className="text-sm text-muted-foreground">2 mm</span>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="font-medium">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={100}
                    max={1000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">₹100</span>
                    <span className="text-sm text-muted-foreground">₹1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
