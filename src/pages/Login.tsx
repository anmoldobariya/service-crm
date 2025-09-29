import { LoginFormFields } from '@/components/formFields/login'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import * as z from 'zod'

const loginSchema = z.object({
	email: z.email('Please enter a valid email address'),
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
									{LoginFormFields.map(formField => (
										<FormField
											control={form.control}
											name={formField.name}
											key={formField.name}
											render={({ field }) => (
												<FormItem>
													<FormLabel>{formField.label}</FormLabel>
													<FormControl>
														<Input
															type={formField.type}
															placeholder={formField.placeholder}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									))}
									{error && (
										<div className="text-sm text-red-600 mt-2">
											{error}
										</div>
									)}
									<Button
										type="submit"
										className="w-full p-6 text-md"
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