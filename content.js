(async () => {
    const googleURL = new URL(location.href)
    if(googleURL.pathname != '/search') return
    const query = googleURL.searchParams.get('q')
        .replace(/(\s*|^)mdn(\s*|$)/i, ' ').trim()
    if(!query) return
    window.stop()
    const type = 'search'
    const locale = 'en-US'
    const message = {type, query, locale}
    const url = await chrome.runtime.sendMessage(message)
    location.href = url
})()
