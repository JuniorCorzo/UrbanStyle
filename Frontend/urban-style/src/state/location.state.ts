import type { Municipality } from '@/interface/address.interface'
import { map } from 'nanostores'

export const MunicipalityStore = map<Municipality[]>([])
