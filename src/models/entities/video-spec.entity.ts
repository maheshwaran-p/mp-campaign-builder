import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type Range = {
    // if min is undefined, null or "", it is treated as 0
    min?: string | number;
  
    // if max is undefined, null or "", it is treated as Infinity
    max?: string | number;
  };
  
  type OneOf = {
    oneOf: (string | number)[];
  
    // if tolerance is undefined, it is treated as 0.
    // If oneOf has string values, they will be coerced to numbers.
    tolerance?: number;
  };

type CreativeSpec = {
    id: string;
    description: string;
  
    // frames per second. Example: {"oneOf": ["23", "29"], "tolerance": 1}
    fps: OneOf;
  
    // duration in seconds. Example: {"oneOf": ["15", "30", "60"], "tolerance": 1},
    duration: OneOf;
  
    // file size in MB. Example: {"max": 150, "min": ""}
    fileSize: Range;
  
    // dimensions. Example:  {"max": "1920x1080"}, {"max": "up 1920x1080"}, "1280x720"
    // For this, we won't consider min.
    // If max starts with "up", we will just strip it and use the value provided.
    // If the value is a string, it is treated as an exact match.
    dimensions: Range | string;
  
    // file format. Example: {"oneOf": ["mp4", "MOV", "avi"]}
    // The check
    fileFormat: OneOf;
  
    // aspect ratio. Example: {"oneOf": ["16:9", "4:3"]}
    aspectRatio: OneOf;
  
    // audio bitrate in bps. Example: {"max": 100000000, "min": 192000}
    audioBitrate: Range;
  
    // video bitrate in bps. Example: {"max": 100000000, "min": 3000000}
    videoBitrate: Range;
  
    // asset tracking. Example: {"oneOf": ["VAST Tag"]}
    assetTracking: OneOf;
  };
  
@Entity('video_spec')
export class VideoSpec {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  specs: CreativeSpec;

  @Column({
    name: 'created',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;

  @Column({
    name: 'updated',
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated: Date;
}
