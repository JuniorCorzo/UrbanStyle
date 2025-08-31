import { ResponseException } from '@/exceptions/response.exception'
import type { User } from '@/interface/user.interface'
import { AuthService } from '@/service/auth.service'
import { atom, onMount } from 'nanostores'

export const userStore = atom<User | null>(null)
onMount(userStore, () => {
	initializeUser()
})

const initializeUser = async () => {
	await AuthService.verifyToken().then((user) => {
		if (!user.success) throw new ResponseException(user.error)
		userStore.set(user.data)
	})
}
