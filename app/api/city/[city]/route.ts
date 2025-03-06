import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { city: string } }
) {
    try {
        // TODO: Replace with actual MongoDB query
        // This is a mock response for now
        const mockData = {
            machines: [
                {
                    id: '1',
                    name: '3D Printer XYZ-2000',
                    makerspaceName: 'TechHub',
                    location: 'Delhi',
                    rating: 4.5,
                    categories: ['3D Printing', 'Rapid Prototyping'],
                    description: 'High-precision 3D printer with multi-material support.',
                    image: '/assetlist.png',
                    price: '500'
                },
                {
                    id: '2',
                    name: 'Laser Cutter ABC-1000',
                    makerspaceName: 'InnoSpace',
                    location: 'Bengaluru',
                    rating: 4.7,
                    categories: ['Laser Cutting', 'Engraving'],
                    description: 'Versatile laser cutter for precision cutting and engraving.',
                    image: '/assetlist.png',
                    price: '500'
                },
                {
                    id: '3',
                    name: 'CNC Router DEF-3000',
                    makerspaceName: 'CreateLab',
                    location: 'Bengaluru',
                    rating: 4.6,
                    categories: ['CNC Router', 'Woodworking'],
                    description: 'High-performance CNC router for detailed woodworking projects.',
                    image: '/assetlist.png',
                    price: '500'
                },
            ],
            events: [
                {
                    id: '1',
                    name: '3D Printing Workshop',
                    location: 'Delhi',
                    date: '2024-02-15',
                    time: '14:00 - 17:00',
                    categories: ['Workshop', '3D Printing'],
                    rating: 4.8,
                    description: 'Learn the basics of 3D printing in this hands-on workshop.',
                    image: '/assetlist.png',
                },
                {
                    id: '2',
                    name: 'Laser Cutting Seminar',
                    location: 'Mumbai',
                    date: '2024-03-10',
                    time: '10:00 - 13:00',
                    categories: ['Seminar', 'Laser Cutting'],
                    rating: 4.9,
                    description: 'Explore advanced techniques in laser cutting and engraving.',
                    image: '/assetlist.png',
                },
                {
                    id: '3',
                    name: 'CNC Routing Hackathon',
                    location: 'Bengaluru',
                    date: '2024-04-05',
                    time: '09:00 - 18:00',
                    categories: ['Hackathon', 'CNC Routing'],
                    rating: 4.7,
                    description: 'Participate in a full-day hackathon focused on CNC routing projects.',
                    image: '/assetlist.png',
                },
            ],
        };

        const filteredMachines = mockData.machines.filter(machine => machine.location.toLowerCase().includes(params.city.toLowerCase()));
        const filteredEvents = mockData.events.filter(event => event.location.toLowerCase().includes(params.city.toLowerCase()));

        return NextResponse.json({ machines: filteredMachines, events: filteredEvents });
    } catch (error) {
        console.error('Error fetching city data:', error);
        return NextResponse.json({ machines: [], events: [] }, { status: 500 });
    }
}