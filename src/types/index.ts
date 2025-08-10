export interface Product {
  id: number
  name: string
  description?: string
  short_description?: string
  price: number
  category_id?: number
  type: "physical" | "digital"
  stock_quantity: number 
  digital_file_url?: string 
  download_limit: number 
  image_urls: string[]
  featured_image?: string
  is_active: boolean
  is_featured: boolean 
  weight_kg?: number 
  dimensions?: {
    legnth: number 
    width: number 
    height: number 
  }
  seo_title?: string 
  seo_description?: string 
  created_at: string 
  updated_at: string 
  category?: Category
}

export interface Category {
  id: number 
  name: string 
  description?: string 
  slug: string 
  image_url?: string 
  is_active: boolean
  created_at: string 
  updated_at: string
}

export interface CartItem {
  id: number 
  user_id: string 
  product_id: number
  quantity: number 
  created_at: string
  updated_at: string
  product: Product
}

export interface Order {
  id: number 
  order_number: string
  user_id: string
  subtotal: number 
  vat_amount: number
  shipping_cost: number 
  total_amount: number 
  status: OrderStatus
  payment_status: PaymentStatus 
  payment_method?: string 
  payment_id?: string 
  billing_address: Address
  shipping_address?: Address 
  notes?: string 
  tracking_number?: string 
  shipped_at?: string
  delivered_at?: string 
  created_at: string 
  updated_at: string
  order_items: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  product_type: "physical" | "digital"
  quantity: number
  unit_price: number
  total_price: number
  digital_download_url?: string
  download_count: number
  download_expires_at?: string
  created_at: string
}

export interface Address {
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  state_province: string
  postal_code: string
  country: string
  phone?: string
}

export interface Profile {
  id: string
  email?: string
  full_name?: string
  phone?: string
  date_of_birth?: string
  avatar_url?: string
  is_admin: boolean
  billing_address?: Address
  shipping_address?: Address
  email_notifications: boolean
  sms_notifications: boolean
  created_at: string
  updated_at: string
}

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"