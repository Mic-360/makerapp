import { MakerSpace } from "./constants";

export async function fetchMachines(): Promise<MakerSpace[]> {
    try {
        const response = await fetch('/api/machines');
        if (!response.ok) {
            throw new Error('Failed to fetch machines');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching makerspaces:', error);
        return [];
    }
}

export async function fetchCityData(city: string) {
    try {
        const response = await fetch(`/api/city/${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching city data:', error);
        return { machines: [], events: [] };
    }
}
