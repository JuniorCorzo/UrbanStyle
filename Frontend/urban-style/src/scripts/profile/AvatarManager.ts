import { $ } from '@/lib/dom-selector'
import { detectMobile } from '@/lib/utils/is_mobile'
import { UserService } from '@/service/user.service'
import { userStore } from '@/state/user.state'
import Cropper, { CropperCanvas, CropperImage, CropperSelection } from 'cropperjs'

const SELECTORS = {
	INPUT_FILE: '#profile_input',
	PROFILE_IMG: '#profile_avatar',
	CANCEL_BUTTON: '#cancel_button',
	SUBMIT_BUTTON: '#submit_button',
	CAMERA_ICON: '#camera_icon',
	CONTAINER_BUTTONS: '#container_buttons',
	PROFILE_CONTAINER: '#profile_container',
	PROFILE_OVERLAY: '#profile_overlay',
	DELETE_AVATAR: '#delete_avatar',
} as const

/**
 * Class that encapsulates image cropping functionality using Cropper.js v2.
 * Provides methods to initialize, configure, crop, and destroy the cropper instance.
 */
class CropImage {
	private readonly imageElement: HTMLImageElement
	private readonly canvas: CropperCanvas | null
	private readonly cropperImage: CropperImage | null
	private readonly selection: CropperSelection | null
	private readonly cameraIcon: HTMLSpanElement | null
	private readonly containerButtons: HTMLSpanElement | null

	/**
	 * @param imageElement - The HTML image element to be cropped.
	 */
	constructor(imageELement: HTMLImageElement) {
		const cropper = new Cropper(imageELement)

		this.canvas = cropper.getCropperCanvas()
		this.cropperImage = cropper.getCropperImage()
		this.selection = cropper.getCropperSelection()
		this.imageElement = imageELement

		this.cameraIcon = $(SELECTORS.CAMERA_ICON)
		this.containerButtons = $(SELECTORS.CONTAINER_BUTTONS)

		this.initializeConfig()
	}

	/**
	 * Sets the initial cropper configuration.
	 */
	private initializeConfig() {
		if (!this.canvas || !this.selection || !this.cropperImage) {
			console.error('No provide canvas selection and cropperImage ')
			return
		}

		this.cropperImage.initialCenterSize = 'cover'

		this.canvas.classList.add('w-full', 'h-full', 'aspect-square')

		Object.assign(this.selection, {
			aspectRatio: 1,
			movable: false,
			resizable: false,
			outlined: true,
			initialCoverage: 1,
		})

		this.canvas.style.cursor = 'move'

		this.selection.querySelector('cropper-handle[action="move"]')?.classList.add('bg-transparent')

		this.setupEventListeners()
		this.toggleUIState()
	}

	/**
	 * Sets up the required event listeners for the cropper.
	 */
	private setupEventListeners(): void {
		window.addEventListener('resize', () => {
			if (!this.selection) {
				console.error('Selection no provide for resizing')
				return
			}
			this.selection.initialCoverage = 0
			this.selection.initialCoverage = 1
		})

		this.cropperImage?.addEventListener('transform', (event) => {
			if (!this.canvas || !this.cropperImage) return
			const cropperCanvasRect = this.canvas?.getBoundingClientRect()

			const clone = this.cropperImage?.cloneNode() as CropperImage
			clone.style.transform = `matrix(${(event as CustomEvent).detail.matrix.join(', ')})`
			clone.style.opacity = '0'
			this.canvas.appendChild(clone)

			const cloneRect = clone.getBoundingClientRect()
			this.canvas.removeChild(clone)

			if (
				cloneRect.top > cropperCanvasRect.top ||
				cloneRect.right < cropperCanvasRect.right ||
				cloneRect.bottom < cropperCanvasRect.bottom ||
				cloneRect.left > cropperCanvasRect.left
			) {
				event.preventDefault()
			}
		})
	}

	private toggleUIState() {
		this.cameraIcon?.classList.toggle('hidden')
		this.containerButtons?.classList.toggle('hidden')
		this.containerButtons?.classList.toggle('flex')
	}

	/**
	 * Crops the image and returns the result as a DataURL.
	 *
	 * @returns A promise that resolves with the base64 image string, or `undefined` if there is no canvas.
	 */
	crop(): Promise<string> | undefined {
		return this.canvas?.$toCanvas({ width: 500, height: 500 }).then((canvas) => {
			return canvas.toDataURL()
		})
	}

	/**
	 * Destroys the cropper instance and restores the original UI state.
	 */
	destroy() {
		if (this.canvas) {
			this.canvas.remove()
			this.imageElement.removeAttribute('style')

			this.toggleUIState()
		}
	}
}

/**
 * Handles image crop cancellation
 * Destroys crop instance and restores original image
 *
 * @param crop - CropImage instance
 * @param imgElement - Profile image DOM element
 */
const handleCancelCrop = (crop: CropImage, $imgElement: HTMLImageElement): void => {
	crop.destroy()
	const { initializeImg } = $imgElement.dataset

	$imgElement.src = initializeImg ?? ''
}

/**
 * Handles cropped image submission and save
 * Processes image, sends to server and reloads page
 *
 * @param crop - CropImage instance
 */
const handleSubmitCrop = async (crop: CropImage): Promise<void> => {
	const user = userStore.get()
	if (!user) {
		console.error('User no found in store')
		return
	}
	const dataUrl = await crop.crop()

	if (!dataUrl) {
		console.error('Could not generate cropped image')
		return
	}

	const { message } = await UserService.changeAvatar(user.id, dataUrl)
	console.log(message)

	crop.destroy()
	window.location.reload()
}

/**
 * Handles file selection from input
 * Creates preview and initializes cropper
 *
 * @param inputFile - File input element
 * @param profileImg - Profile image element for preview
 */
const handleFileChange = ($inputFile: HTMLInputElement, $profileImg: HTMLImageElement): void => {
	const selectedFile = $inputFile.files?.item(0)

	if (!selectedFile) {
		console.error('No file selected')
		return
	}

	if (!selectedFile.type.startsWith('image/')) {
		console.error('Selected file is not a valid image')
		return
	}

	try {
		const previewUrl = URL.createObjectURL(selectedFile)
		$profileImg.src = previewUrl

		$inputFile.previousElementSibling?.classList.add('hidden')

		const cropInstance = new CropImage($profileImg)
		setupCropActionListeners(cropInstance, $profileImg)
	} catch (error) {
		console.error('Error processing file selection:', error)
	}
}

const handleDeleteAvatar = () => {
	const user = userStore.get()
	if (!user) {
		console.error('User not found')
		return
	}

	UserService.deleteAvatar(user.id).then(({ message }) => {
		console.log(message)
		window.location.reload()
	})
}

/**
 * Sets up listeners for cancel and confirm buttons
 * Prevents duplicate listeners by cloning elements
 *
 * @param cropInstance - CropImage instance
 * @param $profileImg - Profile image element
 */
const setupCropActionListeners = (cropInstance: CropImage, $profileImg: HTMLImageElement): void => {
	const cancelButton = $(SELECTORS.CANCEL_BUTTON)
	const submitButton = $(SELECTORS.SUBMIT_BUTTON)

	// Remove previous listeners by cloning elements
	if (cancelButton) {
		const newCancelButton = cancelButton.cloneNode(true) as HTMLElement
		cancelButton.parentNode?.replaceChild(newCancelButton, cancelButton)
		newCancelButton.addEventListener('click', () => handleCancelCrop(cropInstance, $profileImg))
	}

	if (submitButton) {
		const newSubmitButton = submitButton.cloneNode(true) as HTMLElement
		submitButton.parentNode?.replaceChild(newSubmitButton, submitButton)
		newSubmitButton.addEventListener('click', () => handleSubmitCrop(cropInstance))
	}
}

const handleTouch = () => {
	const $profileOverlay = $(SELECTORS.PROFILE_OVERLAY)
	if (!$profileOverlay) {
		console.error('No DOMElement found for profile overlay')
		return
	}

	const isMobile = detectMobile()

	if (isMobile) {
		const hasOpen = $profileOverlay?.hasAttribute('data-open')
		if (hasOpen) {
			$profileOverlay.removeAttribute('data-open')
			return
		}

		$profileOverlay.setAttribute('data-open', '')
	}
}

/**
 * Initializes all avatar module listeners
 * Main entry point for the module
 * Compatible with Astro's hydration patterns
 */
const initializeAvatarListeners = (): void => {
	const $inputFile = $<HTMLInputElement>(SELECTORS.INPUT_FILE)
	const $profileImg = $<HTMLImageElement>(SELECTORS.PROFILE_IMG)
	const $deleteAvatar = $<HTMLButtonElement>(SELECTORS.DELETE_AVATAR)

	if (!$inputFile || !$profileImg) {
		console.error('Required DOM elements not found')
		return
	}

	$profileImg.addEventListener('touchstart', handleTouch)

	// Main file selection listener
	$inputFile.addEventListener('change', () => {
		handleFileChange($inputFile, $profileImg)
	})

	$deleteAvatar?.addEventListener('click', handleDeleteAvatar)
	console.log('Avatar listeners initialized successfully')
}

/**
 * Cleanup function to free resources
 * Useful for SPA navigation or component unmounting
 */
const cleanupAvatarModule = (): void => {
	// Revoke any blob URLs that might be in use
	const profileImg = $<HTMLImageElement>(SELECTORS.PROFILE_IMG)
	if (profileImg?.src.startsWith('blob:')) {
		URL.revokeObjectURL(profileImg.src)
	}
}

export default {
	initializeAvatarListeners,
	cleanupAvatarModule,
}
