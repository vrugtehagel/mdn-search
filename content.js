(async () => {
    const googleURL = new URL(location.href)
    if(googleURL.pathname != '/search') return
    const q = googleURL.searchParams.get('q')
    const regex = /(\s*|^)mdn(\s*|$)/i
    if(!regex.test(q)) return
    const query = q.replace(regex, ' ').trim()
    if(!query) return
    window.stop()
    const type = 'search'
    const locale = 'en-US'
    const message = {type, query, locale}
    const url = await chrome.runtime.sendMessage(message)
    location.href = url
})()
