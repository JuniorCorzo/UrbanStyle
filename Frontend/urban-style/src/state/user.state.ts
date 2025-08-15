import type { User } from '@/interface/user.interface'
import { verifyToken } from '@/service/auth.service'
import { atom, onMount } from 'nanostores'

export const userStore = atom<User | null>(null)
onMount(userStore, () => {
	verifyToken().then((user) => userStore.set(user))
})
