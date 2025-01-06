'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, ArrowUpDown } from 'lucide-react';

export default function MembershipsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="secondary" className="bg-[#F5F5F5] text-gray-700">
            Manage
          </Button>
          <Button variant="ghost" className="text-gray-700">
            All Members
          </Button>
        </div>
        <Button className="bg-gray-900 text-white rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <div className="flex space-x-2">
        <Select defaultValue="all-events">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-events">All Events</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="trash">Trash</SelectItem>
          </SelectContent>
        </Select>
        <Input className="w-[200px]" placeholder="Search members..." />
      </div>

      <Card className="bg-white rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[250px]">
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{/* Add table rows here when you have data */}</TableBody>
        </Table>
      </Card>

      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Plus className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Add Events</p>
        </div>
      </div>
    </div>
  );
}
