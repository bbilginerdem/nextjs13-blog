import { NextResponse } from 'next/server'
import dbConnect from '@/utils/dbConnect'
import User from '@/models/user'
import bcrypt from 'bcrypt'

export async function POST(req) {
	const _req = await req.json() // req.body
	console.log(_req)
	await dbConnect()

	try {
		const { name, email, password } = _req
		// check if user with email already exists
		const existingUser = await User.findOne({ email })

		if (existingUser) {
			return NextResponse.error(
				{ err: 'User already exists' },
				{ status: 409 },
			)
		} else {
			await new User({
				name,
				email,
				password: await bcrypt.hash(password, 10),
			}).save()

			return NextResponse.json({
				success: 'Registration successful. Please login.',
			})
		}
	} catch (err) {
		console.error(err)
		return NextResponse.error(
			{ err: 'Server error. Try Again' },
			{ status: 500 },
		)
	}
}
