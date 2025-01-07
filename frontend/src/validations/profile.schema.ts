// path: src/validations/profile.schema.ts

import { z } from "zod";

/**
 * 백엔드의 ProfileUpdate를 참조할 수도 있지만,
 * 여기서는 프론트 폼 검증을 위해 간단히 zod 스키마를 선언
 */
export const profileUpdateSchema = z.object({
  role: z
    .string()
    .max(255, "Role must not exceed 255 characters")
    .optional(),
  avatar_url: z
    .string()
    .max(1000, "URL too long")
    .url("Invalid URL format")
    .optional()
    .or(z.literal("")), // 빈 문자열 허용
  bio: z
    .string()
    .max(2000, "Bio must not exceed 2000 characters")
    .optional(),
  birth_date: z
    .string()
    .optional(), 
    // 예: "2025-12-31" 형태
});

// Zod 스키마로부터 TS 타입 추론
export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;
