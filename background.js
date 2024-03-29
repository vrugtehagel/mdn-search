chrome.runtime.onMessage.addListener((message, sender, respond) => ((async () => {
    if(message.type != 'search') return
    const {query, locale} = message
    const url = new URL('https://developer.mozilla.org/api/v1/search')
    url.searchParams.set('locale', locale)
    url.searchParams.set('q', query)
    const response = await fetch(url)
    const {documents} = await response.json()
    const keywords = query.split(/\s+/)
    const sorter = callback => (a, b) => callback(b) - callback(a)
    documents.sort(sorter(({title, score, popularity}) => {
        const sensitiveScore = keywords.filter(keyword => title.includes(keyword)).length
        const insensitiveScore = keywords.filter(keyword => title.toLowerCase().includes(keyword.toLowerCase())).length
        return 50 * insensitiveScore + 50 * sensitiveScore + score * popularity
    }))
    const pathname = documents[0]?.mdn_url ?? `/search?q=${query}`
    respond('https://developer.mozilla.org' + pathname)
})(), true))
