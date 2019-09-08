import translation from './langs/en'

export default (words) => {
	return translation[words] || words
}