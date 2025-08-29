import { initializeReportProducts, productStore } from '@/state/product.store'
import { ProductService } from '@/service/product.service'
import { ProductAdapter } from '@/adapter/product.adapters'
import { imagesStore } from '@/state/attributes.state'
import type { ProductImages, Products } from '@/interface/product.interface'
import { imageToBase64 } from '../utils/image-to-base64'
import { ZodError } from 'zod'
import { showError } from '../showErrorMessages'
import {
	AddImageScheme,
	CreateProductScheme,
	UpdateProductScheme,
} from '../validations/product.validations'
import { formStore } from '@/state/form.state'
import ToasterManager from '../utils/ToasterManager'
import { type Result } from '../result_pattern'
import type { ErrorMessage } from '@/interface/response.interface'

export async function productForm() {
	const handleCreateProduct = async (data: FormData) => {
		try {
			const product = await ProductAdapter.formDataToCreateProduct(data)
			CreateProductScheme.parse(product)

			const response = await ProductService.createProduct(product)
			if (!response.success) throw Error(response.error.toString())

			initializeReportProducts()
		} catch (err) {
			if (err instanceof ZodError) showError(err)
			console.error(err)
		}
	}

	const handleUpdateProduct = async (id: string, data: FormData) => {
		try {
			const product = await ProductAdapter.formDataToUpdateProduct(data, id)

			await checkImages(product.id)

			UpdateProductScheme.parse(product)
			const response = await ProductService.updateProduct(product)
			if (!response.success) throw Error(response.error.toString())

			initializeReportProducts()
		} catch (err) {
			if (err instanceof ZodError) showError(err)
			console.error(err)
		}
	}

	const sendProduct = async (data?: FormData, id?: string) => {
		if (!data) return

		if (id) {
			ToasterManager.emitPromise({
				promise: handleUpdateProduct(id, data),
				config: {
					success: 'Product actualizado con éxito',
					error: 'Ocurrió un error actualizando el producto, intente mas tarde',
				},
			})

			return
		}

		ToasterManager.emitPromise({
			promise: handleCreateProduct(data),
			config: {
				success: 'Producto creado con éxito',
				error: 'Hubo un error creando el producto, intente mas tarde',
			},
		})
	}

	const handleDelete = async (id: string) => {
		const result: Result<string, ErrorMessage> = await ProductService.deleteProduct(id)

		if (!result.success) throw Error(result.error.toString())

		initializeReportProducts()
		return result.data
	}

	const sendDelete = (id: string) => {
		ToasterManager.emitPromise({
			promise: handleDelete(id),
			config: {
				success: 'Producto eliminado con éxito',
				error: 'Hubo un error, vuele a intentar mas tarde',
			},
		})
	}

	formStore.set({
		isVisible: false,
		title: 'Nuevo producto',
		formType: 'product',
		sendData: sendProduct,
		sendDelete,
	})
}

async function checkImages(productId: string) {
	const products = new Map<string, Products>()
	productStore.get().map((product) => products.set(product.id, product))

	const images = imagesStore.get()
	const imagesDelete: ProductImages = {
		productId: productId,
		images: images
			.filter(({ isDelete }) => isDelete === true)
			.map(({ file, color }) => ({ image: file.name, color })),
	}

	const imagesAdd: ProductImages = {
		productId,
		images: await Promise.all(
			images
				.filter(({ isUpload }) => isUpload === false)
				.map(async ({ file, color }) => {
					return { color, image: await imageToBase64(file) }
				}),
		),
	}

	const handleDeleteImage = async () => {
		const response = await ProductService.deleteImageToProduct(imagesDelete)
		if (!response.success) throw Error(response.error.toString())
	}

	const handleAddImages = async () => {
		try {
			AddImageScheme.parse(imagesAdd)

			const response = await ProductService.addImageToProduct(imagesAdd)
			if (!response.success) throw Error(response.error.toString())
		} catch (err) {
			if (err instanceof ZodError) showError(err)
			throw Error()
		}
	}

	if (imagesDelete.images.length > 0) await handleDeleteImage()
	if (imagesAdd.images.length > 0) await handleAddImages()
}
