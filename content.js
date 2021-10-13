const mdnURL = 'https://developer.mozilla.org'

function isEligible(href){
    const url = new URL(href)
    const query = url.searchParams.get('q')
    return url.pathname == '/search'
        && query
        && /( |^)mdn( |$)/i.test(query)
        && query.toLowerCase().trim() != 'mdn'
}

async function searchMDN(query, locale){
    const url = new URL(mdnURL + '/api/v1/search')
    url.searchParams.set('locale', locale)
    url.searchParams.set('q', query)
    const {href} = url
    const response = await fetch(href)
    const data = await response.json()
    return data.documents
}

function showNoResults(query, locale){
    location.href = `${mdnURL}/${locale}/search?q=${query}`
}

function getBestResult(results){
    const rank = ({score, popularity}) =>
        score * (1 + 20 * popularity)
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .sort((a, b) => rank(b) - rank(a))
        .at(0)
}

async function findOnMDN(query, locale = 'en-US'){
    const results = await searchMDN(query, locale)
    if(results.length == 0)
        return showNoResults(query, locale)
    const best = getBestResult(results)
    const pageURL = best['mdn_url']
    location.href = pageURL[0] == '/'
        ? mdnURL + pageURL
        : pageURL
}

function processQuery(query){
    return /\smdn\s/i.test(query)
        ? query.replace(/\s+mdn\s+/i, ' ')
        : query.replace(/(\s*|^)mdn(\s*|$)/i, '')
}

if(isEligible(location.href)){
    window.stop()
    const url = new URL(location.href)
    const query = processQuery(url.searchParams.get('q'))
    findOnMDN(query)
}
