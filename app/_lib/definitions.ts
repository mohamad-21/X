import { z } from "zod";

export interface SignupData {
  name: string;
  email: string;
  year: string;
  month: string;
  day: string;
}

export interface VerificationData {
  code: number;
}

export interface PasswordData {
  password: string
}

export interface User {
  id: number | string,
  name: string,
  username: string,
  email: string,
  password: string,
  profile: string,
  bio: string | null,
  location: string | null,
  website: string | null,
  header_photo: string | null,
  birthday: Date | null,
  created_at: Date | string,
  updated_at: Date | string
}

export interface UserFollowingsAndFollowersTable {
  id: number,
  follower_id: number,
  following_id: number
}

export interface UserFollowingsAndFollowers {
  followers: number[],
  followings: number[]
}


export type SessionUser = {
  id: string | number,
  name: string
  email: string
  image: string,
  username: string,
  follows: UserFollowingsAndFollowers
}

export interface AddTwitt {
  userId: string | number,
  text: string,
  formData?: FormData,
  gif?: string,
  replyTo?: string | number
}

export interface TwittsTable {
  id: number,
  user_id: string | number,
  text: string,
  media: string | null,
  media_type: 'image' | 'gif' | 'video' | null,
  likes: (number | string)[],
  views: (number | string)[],
  comments: (number | string)[],
  retwitts: (number | string)[],
  reply_to: number | null,
  created_at: Date,
  updated_at: Date,
}

export interface ITwitt extends Omit<TwittsTable, 'image'> {
  username: string,
  name: string,
  user_profile: string,
}

export interface Verification {
  id: number,
  email: string,
  code: number,
  expires_at: Date
}

export interface NotificationsTable {
  id: number,
  user_id: number,
  opposite_id: number,
  type: "follow" | "like" | "reply" | null,
  place_id: number | null,
  text: string | null,
  is_viewed: 0 | 1
}
export interface INotification extends NotificationsTable {
  profile: string,
  name: string,
  username: string,
  twitt?: ITwitt | null,
  notified?: 0 | 1
}

export interface ModalProps {
  className?: string,
  defaultOpen?: boolean,
  isDismissable?: boolean,
  defaultBackdrop?: boolean,
  centerContent?: boolean,
  classNames?: {
    wrapper?: string,
    base?: string,
    header?: string,
    backdrop?: string,
    body?: string,
    footer?: string,
    closeButton?: string
  }
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  radius?: "sm" | "md" | "lg" | "none";
  scrollBehavior?: "normal" | "inside" | "outside";
  backdrop?: "transparent" | "opaque" | "blur";
  isKeyboardDismissDisabled?: boolean | undefined,
  shouldBlockScroll?: boolean,
  ignureMobileSize?: boolean,
  placement?: "center" | "auto" | "top" | "top-center" | "bottom" | "bottom-center"
}

export type ActionError = {
  message: string
} | void;

export const SignupScheme: z.ZodType<SignupData> = z.object({
  name: z.string({
    errorMap: () => ({ message: "What's your name?" })
  }).trim().min(1),
  email: z.string().email({
    message: "Please enter a valid email"
  }),
  year: z.string({
    errorMap: () => ({ message: "Please choose year" })
  }).min(4),
  month: z.string({
    errorMap: () => ({ message: "Please choose month" })
  }).min(1),
  day: z.string({
    errorMap: () => ({ message: "Please choose day" })
  }).min(1),
})

export const VerificationScheme: z.ZodType<VerificationData> = z.object({
  code: z.coerce.number().lte(99999, {
    message: 'Enter the verification code (5 digits)'
  }).gte(10000, {
    message: 'Enter the verification code (5 digits)'
  })
})

export const PasswordScheme: z.ZodType<PasswordData> = z.object({
  password: z.string().min(8, {
    message: "password must be more than 8 characters"
  }),
})