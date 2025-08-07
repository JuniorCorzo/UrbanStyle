export function dispatchUrlChange() {
	window.dispatchEvent(new CustomEvent('url-change'))
}
