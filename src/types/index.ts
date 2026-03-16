export type ProjectType = {
  _id: string
  title: string
  slug: string
  category: string
  description: string
  location: string
  year: number
  images: string[]
  coverImage: string
  featured: boolean
  status: 'published' | 'draft'
  createdAt: string
}

export type PropertyType = {
  _id: string
  title: string
  type: 'sell' | 'rent'
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  coverImage: string
  description: string
  status: 'available' | 'sold' | 'rented'
  featured: boolean
  createdAt: string
}

export type ArticleType = {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  status: 'published' | 'draft'
  createdAt: string
}
