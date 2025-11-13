import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeographyToolService {
  async geocodeLocationGoogle(query: string): Promise<{ latitude: number; longitude: number } | null> {
    const key = process.env.MAPS_API_KEY;
    if (!key) {
      console.warn('[GeographyToolService] MAPS_API_KEY not set. Cannot geocode.');
      return null;
    }
    try {
      const url = 'https://maps.googleapis.com/maps/api/geocode/json';
      console.log(`[GeographyToolService] Invoking Maps API for location: ${query}`);
      const resp = await axios.get(url, { params: { address: query, key } });
      const results = resp.data?.results;
      if (!results || results.length === 0) {
        console.warn(`[GeographyToolService] No results from Maps API for: ${query}`);
        return null;
      }
      const loc = results[0].geometry?.location;
      console.log(`[GeographyToolService] Maps API returned lat/lng: ${loc.lat}, ${loc.lng} for ${query}`);
      return { latitude: Number(loc.lat), longitude: Number(loc.lng) };
    } catch (err) {
      console.error(`[GeographyToolService] Error invoking Maps API for ${query}:`, err);
      return null;
    }
  }
}
