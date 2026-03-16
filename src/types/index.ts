export type ProjectType = {
  id: string
  title: string
  slug: string
  category: string
  description: string
  location: string
  year: number
  images: string[]
  coverImage: string
  featured: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export type PropertyType = {
  id: string
  title: string
  type: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  coverImage: string
  description: string
  status: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export type ArticleType = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  status: string
  createdAt: string
  updatedAt: string
}

export type MessageType = {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}
