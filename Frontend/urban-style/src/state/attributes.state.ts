import type { AttributesWithId } from '@/components/dashboard/react/components/forms/AttributeFields'
import type { ImageState } from '@/components/react/hooks/useImages'
import { atom } from 'nanostores'

export const attributeStore = atom<AttributesWithId[]>([])
export const imagesStore = atom<ImageState[]>([])
