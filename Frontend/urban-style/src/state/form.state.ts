import type { FormMediator } from '@/interface/form-mediator.interface'
import { atom, map } from 'nanostores'

export const formStore = map<FormMediator>()
