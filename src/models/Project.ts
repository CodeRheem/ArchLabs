import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
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
  createdAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true }, // e.g. "Residential", "Commercial"
    description: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: Number, required: true },
    images: [{ type: String }],
    coverImage: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  },
  { timestamps: true }
)

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
