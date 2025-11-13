import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

interface AudienceSegment {
  id: string;             
  name: string;            
  truncatedName: string;  
}

@Injectable()
export class AudienceToolService implements OnModuleInit {
  private readonly logger = new Logger(AudienceToolService.name);
  private segments: AudienceSegment[] = [];
  
  async onModuleInit() {
    try {
      await this.loadSegmentsFromCsv();
      this.logger.log(`Loaded ${this.segments.length} audience segments from CSV`);
    } catch (error) {
      this.logger.error(`Failed to load CSV: ${error.message}`);
      throw error; 
    }
  }

  private async loadSegmentsFromCsv(): Promise<void> {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'audience-segments.csv');
    
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(csvPath)) {
        return reject(new Error(`CSV file not found at ${csvPath}`));
      }

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          const numericId = data[Object.keys(data)[0]];
          
          if (numericId && data.truncated_name && data.display_name) {
            this.segments.push({
              id: numericId.trim(),                  
              name: data.display_name.trim(),       
              truncatedName: data.truncated_name.trim() 
            });
          }
        })
        .on('end', () => {
          this.segments.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }

  getAllSegments() {
    return this.segments;
  }

  getSegmentById(id: string) {
    return this.segments.find(seg => seg.id === id);
  }

  getSegmentByTruncatedName(truncatedName: string) {
    return this.segments.find(seg => seg.truncatedName === truncatedName);
  }
  
  searchSegments(query: string) {
    const normalizedQuery = query.toLowerCase().trim();
    return this.segments.filter(segment => 
      segment.name.toLowerCase().includes(normalizedQuery) || 
      segment.truncatedName.toLowerCase().includes(normalizedQuery)
    );
  }
  
  getCategorizedSegments() {
    const categorized = new Map<string, AudienceSegment[]>();
    
    this.segments.forEach(segment => {
      const prefix = segment.truncatedName.split('-')[0];
      if (!categorized.has(prefix)) {
        categorized.set(prefix, []);
      }
      categorized.get(prefix)?.push(segment);
    });
    
    // map to array of category objects
    return Array.from(categorized.entries()).map(([prefix, segments]) => ({
      category: prefix,
      segments
    }));
  }
}