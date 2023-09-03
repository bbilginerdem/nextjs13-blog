import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			// required: [true, 'Please provide your name'],
			// trim: true,
			// maxlength: [20, 'Name cannot be more than 20 characters']
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			index: true,
			lowercase: true,
		},
		password: {
			type: String,
		},
		role: {
			type: String,
			default: 'user',
		},
		image: String,
	},
	{ timestamps: true },
)

export default mongoose.models.User || mongoose.model('User', userSchema)
