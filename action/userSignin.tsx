'use server'
 
import { signIn } from '@/auth'
 
export async function authenticate(data: FormData | ({ redirectTo?: string; redirect?: true | undefined } & Record<string, any>) | undefined) {
    
  try {
    await signIn('credentials', data)
  } catch (error) {
    if (error) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {'error':''}
        default:
          return error
      }
    }
    throw error
  }
}