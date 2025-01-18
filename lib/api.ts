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
