import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

interface TVChannel {
  Station: string;
  OneSentenceSummary: string;
}

interface SignageLocation {
  Area: string;
  AudienceType: string;
}

interface StreamingTVChannel {
  Platform: string;
  Description: string;
}

@Injectable()
export class ChannelsToolService implements OnModuleInit {
  private linearTVCache: TVChannel[] = [];
  private streamingTVCache: StreamingTVChannel[] = [];
  private signageLocationsCache: SignageLocation[] = [];
  private isDataLoaded = false;

  async onModuleInit() {
    console.log('[ChannelsToolService] Initializing and loading channel data...');
    await this.loadAllChannelData();
  }

  private async loadAllChannelData(): Promise<void> {
    try {
      await Promise.all([
        this.loadLinearTVChannels(),
        this.loadStreamingTVChannels(),
        this.loadSignageLocations()
      ]);
      this.isDataLoaded = true;
      console.log('[ChannelsToolService] Successfully loaded all channel data');
      console.log(`[ChannelsToolService] Linear TV: ${this.linearTVCache.length}, Streaming TV: ${this.streamingTVCache.length}, Signage Locations: ${this.signageLocationsCache.length}`);
    } catch (error) {
      console.error('[ChannelsToolService] Error loading channel data:', error);
      throw error;
    }
  }

  private async loadLinearTVChannels(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/linear-tv.csv');
    console.log(`[ChannelsToolService] Loading Linear TV channels from: ${filePath}`);

    return new Promise((resolve, reject) => {
      const channels: TVChannel[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          channels.push(row as TVChannel);
        })
        .on('end', () => {
          this.linearTVCache = channels;
          console.log(`[ChannelsToolService] Loaded ${channels.length} Linear TV channels`);
          resolve();
        })
        .on('error', (error) => {
          console.error('[ChannelsToolService] Error reading Linear TV channels CSV:', error);
          reject(error);
        });
    });
  }

  private async loadStreamingTVChannels(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/streaming-tv.txt');
    console.log(`[ChannelsToolService] Loading Streaming TV channels from: ${filePath}`);

    return new Promise((resolve, reject) => {
      const channels: StreamingTVChannel[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          channels.push(row as StreamingTVChannel);
        })
        .on('end', () => {
          this.streamingTVCache = channels;
          console.log(`[ChannelsToolService] Loaded ${channels.length} Streaming TV channels`);
          resolve();
        })
        .on('error', (error) => {
          console.error('[ChannelsToolService] Error reading Streaming TV channels TXT:', error);
          reject(error);
        });
    });
  }

  private async loadSignageLocations(): Promise<void> {
    const filePath = path.join(__dirname, '../../data/tokyo_signage.csv');
    console.log(`[ChannelsToolService] Loading signage locations from: ${filePath}`);

    return new Promise((resolve, reject) => {
      const locations: SignageLocation[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          locations.push(row as SignageLocation);
        })
        .on('end', () => {
          this.signageLocationsCache = locations;
          console.log(`[ChannelsToolService] Loaded ${locations.length} signage locations`);
          resolve();
        })
        .on('error', (error) => {
          console.error('[ChannelsToolService] Error reading signage locations CSV:', error);
          reject(error);
        });
    });
  }

  getLinearTVChannels(): TVChannel[] {
    return this.linearTVCache;
  }

  getStreamingTVChannels(): StreamingTVChannel[] {
    return this.streamingTVCache;
  }

  getSignageLocations(): SignageLocation[] {
    return this.signageLocationsCache;
  }
}
