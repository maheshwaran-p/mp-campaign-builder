/* Copyright (c) 2025 C1X, All rights reserved. */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('partner_product')
export class PartnerProduct {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  id!: number;

  @Column({
    name: 'partner_id',
    type: 'int',
    nullable: false,
  })
  partnerId!: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  name!: string | null;

  @Column({
    name: 'content_package',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  contentPackage!: string | null;

  @Column({
    name: 'inventory_type',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  inventoryType!: string | null;

  @Column({
    name: 'device',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  device!: string | null;

  @Column({
    name: 'retail_rate',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  retailRate!: number | null;

  @Column({
    name: 'wholesale_rate',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  wholesaleRate!: number | null;

  @Column({
    name: 'buy_rate',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  buyRate!: number | null;

  @Column({
    name: 'created',
    type: 'datetime',
    nullable: false, // Typically 'created' is not nullable
    default: () => 'CURRENT_TIMESTAMP',
  })
  created!: Date;

  @Column({
    name: 'updated',
    type: 'datetime',
    nullable: false, // Typically 'updated' is not nullable
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated!: Date;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  updatedBy!: string | null;

  @Column({
    name: 'is_active',
    type: 'tinyint',
    nullable: false, // Default value implies it's never truly null
    default: () => 1,
  })
  isActive!: number;

  @Column({
    name: 'wholesale_surcharge',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  wholesaleSurcharge!: number | null;

  @Column({
    name: 'retail_surcharge',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  retailSurcharge!: number | null;

  @Column({
    name: 'is_partner_visible',
    type: 'tinyint',
    nullable: false, // Default value implies it's never truly null
    default: () => 1,
  })
  isPartnerVisible!: number;

  @Column({
    name: 'treat_as_fee',
    type: 'tinyint',
    nullable: true,
  })
  treatAsFee!: number | null;

  @Column({
    name: 'video_spec_id',
    type: 'int',
    nullable: true,
  })
  videoSpecId!: number | null;

  @Column({
    name: 'thumbnail_url',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  thumbnailUrl!: string | null;

  @Column({
    name: 'min_spend',
    type: 'bigint',
    nullable: true,
  })
  minSpend!: number | null;

  @Column({
    name: 'ad_server_id',
    type: 'int',
    nullable: false, // Assuming this should be non-nullable if no `nullable: true` is set
  })
  adServerId!: number;

  @Column({
    name: 'product_template_id',
    type: 'int',
    nullable: true,
  })
  productTemplateId!: number;
}
