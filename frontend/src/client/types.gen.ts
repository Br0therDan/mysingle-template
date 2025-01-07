// This file is auto-generated by @hey-api/openapi-ts

export type Body_Login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type ItemCreate = {
  title: string
  description: string | null
}

export type ItemPublic = {
  title: string
  description: string | null
  id: string
  owner_id: string
  created_at: string
  updated_at: string
}

export type ItemsPublic = {
  data: Array<ItemPublic>
  count: number
}

export type ItemUpdate = {
  title: string | null
  description: string | null
  id: string
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  new_password: string
}

export type PrivateUserCreate = {
  email: string
  password: string
  full_name: string
  is_verified?: boolean
}

/**
 * Profile 생성 요청 스키마
 */
export type ProfileCreate = {
  first_name: string | null
  last_name: string | null
  avatar_url?: string | null
  bio: string | null
  birth_date: string | null
  roles?: Array<Role> | null
  user_id: string
  role_ids?: Array<number> | null
}

/**
 * Profile 공개 데이터 응답 스키마
 */
export type ProfilePublic = {
  first_name: string | null
  last_name: string | null
  avatar_url?: string | null
  bio: string | null
  birth_date: string | null
  roles?: Array<Role> | null
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * Profile 수정 요청 스키마
 */
export type ProfileUpdate = {
  first_name: string | null
  last_name: string | null
  avatar_url?: string | null
  bio: string | null
  birth_date: string | null
  roles?: Array<Role> | null
  role_ids?: Array<number> | null
}

/**
 * Role 데이터 응답 스키마
 */
export type Role = {
  name: string
  id: number
}

export type Token = {
  access_token: string
  token_type?: string
}

/**
 * 비밀번호 변경용 스키마
 */
export type UpdatePassword = {
  current_password: string
  new_password: string
}

/**
 * 회원 생성 시 클라이언트로부터 받는 데이터
 */
export type UserCreate = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password: string
}

/**
 * API 응답용 (public) 스키마
 * id, created_at, updated_at 등을 노출.
 */
export type UserPublic = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  id: string
  created_at: string
  updated_at?: string | null
  items?: Array<ItemPublic> | null
  profile?: ProfilePublic | null
}

/**
 * 공용 회원가입 스키마
 */
export type UserRegister = {
  email: string
  password: string
  full_name?: string | null
}

/**
 * 다수의 UserPublic와 총 개수를 담는 응답형 스키마
 */
export type UsersPublic = {
  data: Array<UserPublic>
  count: number
}

/**
 * 관리자(또는 권한 있는 사용자)가
 * 다른 유저 정보를 업데이트할 때 사용
 */
export type UserUpdate = {
  email?: string | null
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password?: string | null
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}

export type ItemsReadMyItemsData = {
  limit?: number
  skip?: number
}

export type ItemsReadMyItemsResponse = ItemsPublic

export type ItemsCreateItemData = {
  requestBody: ItemCreate
}

export type ItemsCreateItemResponse = ItemPublic

export type ItemsReadItemByIdData = {
  itemId: string
}

export type ItemsReadItemByIdResponse = ItemPublic

export type ItemsUpdateItemData = {
  itemId: string
  requestBody: ItemUpdate
}

export type ItemsUpdateItemResponse = ItemPublic

export type ItemsDeleteItemData = {
  itemId: string
}

export type ItemsDeleteItemResponse = unknown

export type ItemsCreateUserData = {
  requestBody: PrivateUserCreate
}

export type ItemsCreateUserResponse = UserPublic

export type LoginLoginAccessTokenData = {
  formData: Body_Login_login_access_token
}

export type LoginLoginAccessTokenResponse = Token

export type LoginTestTokenResponse = UserPublic

export type LoginRecoverPasswordData = {
  email: string
}

export type LoginRecoverPasswordResponse = Message

export type LoginResetPasswordData = {
  requestBody: NewPassword
}

export type LoginResetPasswordResponse = Message

export type LoginRecoverPasswordHtmlContentData = {
  email: string
}

export type LoginRecoverPasswordHtmlContentResponse = string

export type UsersReadUsersData = {
  limit?: number
  skip?: number
}

export type UsersReadUsersResponse = UsersPublic

export type UsersCreateUserData = {
  requestBody: UserCreate
}

export type UsersCreateUserResponse = UserPublic

export type UsersReadUserMeResponse = UserPublic

export type UsersDeleteUserMeResponse = Message

export type UsersUpdatePasswordMeData = {
  requestBody: UpdatePassword
}

export type UsersUpdatePasswordMeResponse = Message

export type UsersReadUserByIdData = {
  userId: string
}

export type UsersReadUserByIdResponse = UserPublic

export type UsersUpdateUserData = {
  requestBody: UserUpdate
  userId: string
}

export type UsersUpdateUserResponse = UserPublic

export type UsersDeleteUserData = {
  userId: string
}

export type UsersDeleteUserResponse = Message

export type UsersRegisterUserData = {
  requestBody: UserRegister
}

export type UsersRegisterUserResponse = UserPublic

export type UsersReadProfileData = {
  userId: string
}

export type UsersReadProfileResponse = ProfilePublic

export type UsersCreateProfileData = {
  requestBody: ProfileCreate
  userId: string
}

export type UsersCreateProfileResponse = ProfilePublic

export type UsersUpdateProfileData = {
  requestBody: ProfileUpdate
  userId: string
}

export type UsersUpdateProfileResponse = ProfilePublic

export type UtilsTestEmailData = {
  emailTo: string
}

export type UtilsTestEmailResponse = Message

export type UtilsVerificationEmailData = {
  emailTo: string
}

export type UtilsVerificationEmailResponse = Message

export type UtilsHealthCheckResponse = boolean
