import type { FormMediator } from '@/interface/form-mediator.interface'
import { atom } from 'nanostores'

export const formStore = atom<FormMediator | undefined>()
