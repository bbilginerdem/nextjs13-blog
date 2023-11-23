import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  image: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  }
}, { timestamps: true })

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema)
