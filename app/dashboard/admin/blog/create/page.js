'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import 'react-quill/dist/quill.snow.css';

export default function AdminBlogCreate() {
	// state
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('');
	const [image, setImage] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	// image upload to cloudinary
	const uploadImage = async e => {
		const file = e.target.files[0];
		if (file) {
			setLoading(true);
			const formData = new FormData();
			formData.append('file', file);
			formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

			// upload to cloudinary
			try {
				const response = await fetch(process.env.CLOUDINARY_URL, {
					method: 'POST',
					body: formData
				});
				if (response.ok) {
					setLoading(false);
					const data = await response.json();
					// console.log(data)
					setImage(data.secure_url);
				}
			} catch (err) {
				setLoading(false);
				toast.error('An error occured. Try again.');
			}
		}
	};

	// submit to create blog api
	const handleSubmit = async e => {
		try {
			const response = await fetch(`${process.env.API}/admin/blog`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title, content, category, image })
			});

			if (response.ok) {
				router.push('/dashboard/admin');
				toast.success('Blog created successfully');
			} else {
				const errorData = await response.json();
				toast.error(errorData.err);
			}
		} catch (e) {
			toast.error('An error occured. Try again.');
		}
	};

	return (
		<div className='container mb-5'>
			<div className='row'>
				<div className='col'>
					<p className='lead'>Create Blog</p>

					<label className='text-secondary' htmlFor='title'>
						Blog title
					</label>
					<input
						type='text'
						name='title'
						value={title}
						onChange={e => setTitle(e.target.value)}
						className='form-control p-2 my-2'
					/>

					<label className='text-secondary' htmlFor='content'>
						Blog content
					</label>
					<ReactQuill
						className='border rounded my-2'
						name='content'
						value={content}
						onChange={e => setContent(e)}
					/>

					<label className='text-secondary' htmlFor='category'>
						Blog category
					</label>
					<input
						type='text'
						name='category'
						value={category}
						onChange={e => setCategory(e.target.value)}
						className='form-control p-2 my-2'
					/>

					{image && <img src={image} alt='preview' style={{ width: '100px' }} />}

					<div className='d-flex justify-content-between mt-3'>
						<button className='btn btn-outline-secondary'>
							<label className='mt-2' htmlFor='upload-button'>
								{loading ? 'Uploading...' : 'Upload image'}
							</label>
							<input
								id='upload-button'
								type='file'
								accept='image/*'
								onChange={uploadImage}
								hidden
							/>
						</button>

						<button className='btn bg-primary text-light' disabled={loading} onClick={handleSubmit}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
