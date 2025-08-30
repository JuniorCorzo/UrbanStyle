import type { User } from '@/interface/user.interface'
import { AuthService } from '@/service/auth.service'
import { atom, onMount } from 'nanostores'

export const userStore = atom<User | null>(null)
onMount(userStore, () => {
	AuthService.verifyToken().then((user) => {
		if (!user.success) throw new Error(user.error.toString())
		userStore.set(user.data)
	})
})
