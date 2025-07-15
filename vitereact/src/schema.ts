// src/schema.ts
import { z } from 'zod';

// User types
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['guest', 'host', 'admin']),
  verified: z.boolean(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().optional(),
  phone_e164: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.enum(['guest', 'host', 'admin']).default('guest'),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_e164: z.string().nullable().optional(),
  avatar_url: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Location data schema
export const locationDataSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  city: z.string(),
  address: z.string(),
  postal_code: z.string(),
  country: z.string(),
});

// Villa types
export const villaSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  location_data: locationDataSchema,
  price_per_night_usd: z.number(),
  base_price_usd_per_night: z.number().optional(),
  cleaning_fee_usd: z.number().optional(),
  service_fee_ratio: z.number().optional(),
  damage_waiver_ratio: z.number().optional(),
  max_guests: z.number(),
  max_pets: z.number().optional(),
  bedrooms: z.number(),
  bedrooms_total: z.number().optional(),
  bathrooms: z.number(),
  bathrooms_total: z.number().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  thumbnail_url: z.string().optional(),
  host_id: z.string(),
  host_user_id: z.string().optional(),
  status: z.enum(['draft', 'active', 'inactive', 'under_review', 'live', 'suspended']).default('draft'),
  policies: z.object({
    cancellation_tier: z.string(),
    security_deposit_usd: z.number(),
    house_rules: z.array(z.string()),
    checkin_time: z.string(),
    checkout_time: z.string(),
  }).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createVillaInputSchema = z.object({
  host_user_id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location_data: locationDataSchema,
  bedrooms_total: z.number(),
  bathrooms_total: z.number(),
  max_guests: z.number(),
  max_pets: z.number(),
  base_price_usd_per_night: z.number(),
  cleaning_fee_usd: z.number(),
  service_fee_ratio: z.number(),
  damage_waiver_ratio: z.number(),
  status: z.enum(['draft', 'active', 'inactive']),
  policies: z.object({
    cancellation_tier: z.string(),
    security_deposit_usd: z.number(),
    house_rules: z.array(z.string()),
    checkin_time: z.string(),
    checkout_time: z.string(),
  }),
});

export const updateVillaInputSchema = createVillaInputSchema.partial();

export const createRoomTypeInputSchema = z.object({
  villa_id: z.string(),
  type: z.string(),
  name: z.string(),
  beds_json: z.array(z.any()),
});

export const createAmenityInputSchema = z.object({
  villa_id: z.string(),
  name: z.string(),
  category: z.string(),
});

export const createPricingRuleInputSchema = z.object({
  villa_id: z.string(),
  rule_type: z.string(),
  multiplier: z.number(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const createFileUploadInputSchema = z.object({
  uploader_user_id: z.string(),
  purpose: z.string(),
});

export const VillaStatus = z.enum(['draft', 'active', 'inactive', 'under_review', 'live', 'suspended']);

export type Villa = z.infer<typeof villaSchema>;

// Booking types
export const bookingSchema = z.object({
  id: z.string(),
  villa_id: z.string(),
  guest_user_id: z.string(),
  check_in: z.string(),
  check_out: z.string(),
  guests: z.number(),
  amount_usd: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;

// Calendar Event types
export const calendarEventSchema = z.object({
  id: z.string(),
  villa_id: z.string(),
  title: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  type: z.enum(['booking', 'blocked', 'maintenance']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

export const createCalendarEventInputSchema = z.object({
  villa_id: z.string(),
  title: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  type: z.enum(['booking', 'blocked', 'maintenance']),
});

export type CreateCalendarEventInput = z.infer<typeof createCalendarEventInputSchema>;

// Guest Review types
export const guestReviewSchema = z.object({
  id: z.string(),
  booking_id: z.string(),
  villa_id: z.string(),
  guest_user_id: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type GuestReview = z.infer<typeof guestReviewSchema>;

export const createGuestReviewInputSchema = z.object({
  booking_id: z.string(),
  villa_id: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string(),
  content: z.string(),
});

export type CreateGuestReviewInput = z.infer<typeof createGuestReviewInputSchema>;

// Guidebook types
export const guidebookSchema = z.object({
  id: z.string(),
  villa_id: z.string(),
  title: z.string(),
  content_md: z.string(),
  guest_user_id: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Guidebook = z.infer<typeof guidebookSchema>;

// Loyalty Credit types
export const loyaltyCreditSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  amount_usd: z.number(),
  reason: z.string(),
  redeemed: z.boolean().default(false),
  redeemed_at: z.string().nullable().optional(),
  expires_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type LoyaltyCredit = z.infer<typeof loyaltyCreditSchema>;

// Host types
export const hostSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  business_name: z.string().optional(),
  tax_id: z.string().optional(),
  payout_method: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Host = z.infer<typeof hostSchema>;

// Payout types
export const payoutSchema = z.object({
  id: z.string(),
  host_id: z.string(),
  amount_usd: z.number(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  payout_date: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Payout = z.infer<typeof payoutSchema>;

// Message types
export const messageEntrySchema = z.object({
  id: z.string(),
  sender_id: z.string(),
  recipient_id: z.string(),
  body: z.string(),
  sentAt: z.string(),
  read: z.boolean().default(false),
});

export type MessageEntry = z.infer<typeof messageEntrySchema>;

// Pricing types
export interface PricingRecommendation {
  villa_id: string;
  recommended_price: number;
  current_price: number;
  confidence: number;
  reason: string;
}

// Support ticket types
export interface TicketDraft {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}