import { TermsService } from '@/service/terms.service.ts'
import { marked } from 'marked'

export class TermsManage {
	constructor(readonly searchParam: URLSearchParams) {}

	async renderedContent() {
		const version = this.searchParam.get('version')
		if (version) return await this.renderedTermsByVersion(version)

		return this.renderedCurrentTerms()
	}

	private async renderedTermsByVersion(version: string) {
		const response = await TermsService.getTermByVersion(version)

		return response.success
			? marked.parse(response.data.content)
			: '<p>Lo sentimos, la version no existe</p>'
	}

	private async renderedCurrentTerms() {
		const response = await TermsService.getCurrentTerms()

		return response.success
			? marked.parse(response.data.content)
			: '<p>Lo sentimos, no se pudo cargar el contenido.</p>'
	}
}
