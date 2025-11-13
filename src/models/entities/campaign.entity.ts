/* Copyright (c) 2025 C1X, All rights reserved. */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('campaign')
export class Campaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'partner_id', type: 'int', nullable: false })
  partnerId!: number;

  @Column({ name: 'campaign_number', type: 'int', nullable: true })
  campaignNumber!: number | null;

  @Column({
    name: 'campaign_name',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  campaignName!: string | null;

  @Column({ name: 'version', type: 'int', nullable: false, default: 1 })
  version!: number;

  @Column({
    name: 'partner_status',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  partnerStatus!: string;

  @Column({
    name: 'admin_status',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  adminStatus!: string | null;

  @Column({ name: 'advertiser_id', type: 'bigint', nullable: true })
  advertiserId!: number | null;

  @Column({ name: 'agency', type: 'varchar', length: 256, nullable: true })
  agency!: string | null;

  @Column({ name: 'agency_id', type: 'varchar', length: 256, nullable: true })
  agencyId!: string | null;

  @Column({
    name: 'agency_office',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  agencyOffice!: string | null;

  @Column({ name: 'property', type: 'varchar', length: 256, nullable: true })
  property!: string | null;

  @Column({ name: 'flight_start', type: 'datetime', nullable: true })
  flightStart!: Date | null;

  @Column({ name: 'flight_end', type: 'datetime', nullable: true })
  flightEnd!: Date | null;

  @Column({
    name: 'flight_date_type',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  flightDateType!: string | null;

  @Column({ name: 'weeks', type: 'int', nullable: true })
  weeks!: number | null;

  @Column({
    name: 'purchase_order_number',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  purchaseOrderNumber!: string | null;

  @Column({ name: 'target_cpm', type: 'double', nullable: true })
  targetCpm!: number | null;

  @Column({ name: 'overall_budget', type: 'double', nullable: true })
  overallBudget!: number | null;

  @Column({ name: 'overall_campaign_goal', type: 'text', nullable: true })
  overallCampaignGoal!: string | null;

  @Column({
    name: 'key_performance_indicator',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  keyPerformanceIndicator!: string | null;

  @Column({
    name: 'specific_inventory_requirements',
    type: 'text',
    nullable: true,
  })
  specificInventoryRequirements!: string | null;

  @Column({
    name: 'frequency_cap',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  frequencyCap!: string | null;

  @Column({
    name: 'frequency_cap_unit',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  frequencyCapUnit!: string | null;

  @Column({ name: 'goal_notes', type: 'text', nullable: true })
  goalNotes!: string | null;

  @Column({
    name: 'behavioral_targeting',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  behavioralTargeting!: string | null;

  @Column({
    name: 'gender_target',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  genderTarget!: string | null;

  @Column({
    name: 'demo_targeting',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  demoTargeting!: string | null;

  @Column({
    name: 'demo_age_from',
    type: 'int',
    nullable: true,
  })
  demoAgeFrom!: number | null;

  @Column({
    name: 'demo_age_to',
    type: 'int',
    nullable: true,
  })
  demoAgeTo!: number | null;

  @Column({
    name: 'device_type',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  deviceType!: string | null;

  @Column({
    name: 'inventory_type',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  inventoryType!: string | null;

  @Column({
    name: 'targeting_notes',
    type: 'text',
    nullable: true,
  })
  targetingNotes!: string | null;

  @Column({
    name: 'geography_type',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  geographyType!: string | null;

  @Column({
    name: 'geography_value',
    type: 'text',
    nullable: true,
  })
  geographyValue!: string | null;

  @Column({
    name: 'geography_notes',
    type: 'text',
    nullable: true,
  })
  geographyNotes!: string | null;

  @Column({
    name: 'underdelivery_rollover_options',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  underdeliveryRolloverOptions!: string | null;

  @Column({
    name: 'how_to_receive_creative_assets',
    type: 'text',
    nullable: true,
  })
  howToReceiveCreativeAssets!: string | null;

  @Column({
    name: 'kpi_benchmark',
    type: 'text',
    nullable: true,
  })
  kpiBenchmark!: string | null;

  @Column({
    name: 'agency_system',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  agencySystem!: string | null;

  @Column({
    name: 'billing_address',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  billingAddress!: string | null;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes!: string | null;

  @Column({
    name: 'created',
    type: 'datetime',
    nullable: true, // Keeping it nullable as per your provided schema, though often these are not.
    default: () => 'CURRENT_TIMESTAMP',
  })
  created!: Date;

  @Column({
    name: 'updated',
    type: 'datetime',
    nullable: true, // Keeping it nullable as per your provided schema, though often these are not.
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated!: Date;

  @Column({
    name: 'created_by',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  createdBy!: string | null;

  @Column({
    name: 'created_by_email',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  createdByEmail!: string | null;

  @Column({
    name: 'updated_by',
    length: 256,
    nullable: true,
    type: 'varchar',
  })
  updatedBy!: string | null;

  @Column({
    name: 'exported',
    type: 'tinyint',
    default: 0,
  })
  exported!: number;

  @Column({
    name: 'is_active',
    type: 'tinyint',
    default: 1,
  })
  isActive!: number;

  @Column({
    name: 'kpi_comments',
    type: 'text',
    nullable: true,
  })
  kpiComments!: string | null;

  @Column({
    name: 'notified_users',
    length: 500,
    nullable: true,
    type: 'varchar',
  })
  notifiedUsers!: string | null;

  @Column({
    name: 'url',
    length: 500,
    nullable: true,
    type: 'varchar',
  })
  url!: string | null;

  @Column({
    name: 'inventory_exclusions',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  inventoryExclusions!: string | null;

  @Column({
    name: 'order_id',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  orderId!: string | null;

  @Column({
    name: 'max_avail_imp',
    type: 'tinyint',
    nullable: true,
    default: 0,
  })
  maxAvailImp!: boolean | null;

  @Column({
    name: 'recency_cap',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  recencyCap!: string | null;

  @Column({
    name: 'recency_cap_unit',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  recencyCapUnit!: string | null;

  @Column({
    name: 'multiple_demo_ages',
    type: 'tinyint',
    nullable: true,
    default: 0,
  })
  multipleDemoAges!: number | null;

  @Column({
    name: 'rating_service',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  ratingService!: string | null;

  @Column({
    name: 'ae_name',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  aeName!: string | null;

  @Column({
    name: 'ae_email',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  aeEmail!: string | null;

  @Column({
    name: 'buyer_name',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  buyerName!: string | null;

  @Column({
    name: 'buyer_email',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  buyerEmail!: string | null;

  @Column({
    name: 'buyer_office',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  buyerOffice!: string | null;

  @Column({
    name: 'piggyback_imp',
    type: 'tinyint',
    nullable: true,
    default: 0,
  })
  piggybackImp!: boolean | null;

  @Column({
    name: 'product_id',
    type: 'int',
    nullable: true,
  })
  productId!: number | null;

  @Column({
    name: 'advertiser_category',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  advertiserCategory!: string | null;

  @Column({
    name: 'rating_service_year',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  ratingServiceYear!: string | null;

  @Column({
    name: 'book',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  book!: string | null;

  @Column({
    name: 'order_name',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  orderName!: string | null;

  @Column({
    name: 'manager',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  manager!: string | null;

  @Column({
    name: 'account_manager',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  accountManager!: string | null;

  @Column({
    name: 'planner',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  planner!: string | null;

  @Column({
    name: 'trafficker',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  trafficker!: string | null;

  @Column({
    name: 'add_ons',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  addOns!: string | null;

  @Column({
    name: 'daypart',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  daypart!: string | null;

  @Column({
    name: 'targeting_type',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  targetingType!: string | null;

  @Column({
    name: 'handoff_email',
    type: 'text',
    nullable: true,
  })
  handoffEmail!: string | null;

  @Column({
    name: 'last_opv_success_time',
    type: 'datetime',
    nullable: true,
  })
  lastOpvSuccessTime!: Date | null;

  @Column({
    name: 'last_opv_fail_time',
    type: 'datetime',
    nullable: true,
  })
  lastOpvFailTime!: Date | null;

  @Column({
    name: 'frequency_cap_time',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  frequencyCapTime!: string | null;

  @Column({
    name: 'recency_cap_time',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  recencyCapTime!: string | null;

  @Column({
    name: 'creative_mockups',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  creativeMockups!: string | null;

  @Column({
    name: 'kpi_target',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  kpiTarget!: string | null;

  @Column({
    name: 'demographics',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  demographics!: string | null;

  @Column({
    name: 'unique_name',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  uniqueName!: string | null;

  @Column({
    name: 'idb_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  idbNumber!: string | null;

  @Column({
    name: 'billing_source',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  billingSource!: string | null;

  @Column({
    name: 'billing_period',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  billingPeriod!: string | null;

  @Column({
    name: 'edi_enabled',
    type: 'tinyint',
    nullable: true,
  })
  ediEnabled!: number | null;

  @Column({
    name: 'order_type',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  orderType!: string | null;

  @Column({
    name: 'agency_advertiser_id',
    type: 'bigint',
    nullable: true,
  })
  agencyAdvertiserId!: number | null;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  paymentStatus!: string | null;

  @Column({
    name: 'client_code',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  clientCode!: string | null;

  @Column({
    name: 'product_code',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  productCode!: string | null;

  @Column({
    name: 'billing_template',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  billingTemplate!: string | null;

  @Column({
    name: 'client_adv_id',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  clientAdvId!: string | null;

  @Column({
    name: 'order_id2',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  orderId2!: string | null;

  @Column({
    name: 'last_opv_success_time2',
    type: 'datetime',
    nullable: true,
  })
  lastOpvSuccessTime2!: Date | null;

  @Column({
    name: 'last_opv_fail_time2',
    type: 'datetime',
    nullable: true,
  })
  lastOpvFailTime2!: Date | null;

  @Column({
    name: 'last_acceptance_date',
    type: 'datetime',
    nullable: true,
  })
  lastAcceptanceDate!: Date | null;

  @Column({
    name: 'last_forecast_email_sent',
    type: 'datetime',
    nullable: true,
  })
  lastForecastEmailSent!: Date | null;

  @Column({
    name: 'desired_awareness_factor',
    type: 'int',
    nullable: true,
  })
  desiredAwarenessFactor!: number | null;

  @Column({
    name: 'use_guidepost',
    type: 'tinyint',
    nullable: true,
    default: 0,
  })
  useGuidepost!: boolean | null;

  @Column({
    name: 'priority',
    type: 'varchar',
    length: 256,
    nullable: true,
    default: 'P2',
  })
  priority!: string | null;

  @Column({
    name: 'advertiser_category_id',
    type: 'int',
    nullable: true,
  })
  advertiserCategoryId!: number | null;

  @Column({
    name: 'second_planner',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  secondPlanner!: string | null;

  @Column({
    name: 'second_trafficker',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  secondTrafficker!: string | null;

  @Column({
    name: 'conversion_tracking_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  conversionTrackingValue!: number | null;

  @Column({
    name: 'billing_source_other',
    type: 'varchar',
    length: 256,
    default: '',
  })
  billingSourceOther!: string;

  @Column({
    name: 'rate_card',
    type: 'varchar',
    length: 256,
    default: '',
  })
  rateCard!: string;

  @Column({
    name: 'confidence_of_close',
    type: 'int',
    default: 0,
  })
  confidenceOfClose!: number;

  @Column({
    name: 'creative_easy_mode',
    type: 'tinyint',
    default: 0,
  })
  creativeEasyMode!: number;

  @Column({ name: 'order_estimate', type: 'double', nullable: true })
  orderEstimate!: number | null;

  @Column({ name: 'advertiser_hq_state', type: 'char', nullable: true })
  advertiserHqState!: string | null;

  @Column({ name: 'syscodes', type: 'text', nullable: true })
  syscodes!: string | null;

  @Column({ name: 'syscodes_notes', type: 'text', nullable: true })
  syscodesNotes!: string | null;

  @Column({ name: 'syscodes_enabled', type: 'tinyint', nullable: true })
  syscodesEnabled!: boolean | null;

  @Column({ name: 'selfservice_enabled', type: 'tinyint', nullable: true })
  selfServiceEnabled!: boolean | null;

  @Column({
    name: 'forecast_status',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  forecastStatus!: string | null;

  @Column({ name: 'do_not_mail', type: 'tinyint', nullable: true })
  doNotMail!: number | null;

  @Column({ name: 'coop', type: 'tinyint', nullable: true })
  coop!: number | null;

  @Column({ name: 'forecast_count', type: 'int', nullable: true })
  forecastCount!: number | null;
}
