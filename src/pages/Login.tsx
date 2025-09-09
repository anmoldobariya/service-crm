import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, isLoggingIn, isAuthenticated } = useAuth()
	const [error, setError] = useState<string>('')

	// Get the intended destination from location state
	const from = location.state?.from?.pathname || '/'

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true })
		}
	}, [isAuthenticated, navigate, from])

	// Don't render login form if already authenticated
	if (isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
			</div>
		)
	}

	const onSubmit = async (data: LoginFormData) => {
		try {
			setError('')
			await login(data)
			navigate(from, { replace: true })
		} catch (err: any) {
			setError(err?.data?.message || 'Login failed. Please try again.')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-[50vw] h-full flex flex-col">
				<div className='flex items-stretch justify-between p-10 h-full'>
					<img
						src="/logo.svg"
						alt="EMS Logo"
						className='w-100 p-2'
					/>
					<div className="border-l-2 border-gray-300" />
					<div>
						<CardHeader className="space-y-1">
							<CardTitle className="text-2xl text-center">Sign in</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[300px]">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="Enter your email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{error && (
										<div className="text-sm text-red-600 mt-2">
											{error}
										</div>
									)}
									<Button
										type="submit"
										className="w-full bg-[#1e3a8a] p-6 text-md"
										disabled={isLoggingIn}
										size="lg"
									>
										{isLoggingIn ? 'Signing in...' : 'Sign in'}
									</Button>
								</form>
							</Form>
						</CardContent>
					</div>
				</div>
			</Card>
		</div>
	)
}