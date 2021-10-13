// open MDN (any page, you know, CORS) and paste this in the console

console.clear()

const pause = async duration =>
    new Promise(resolve => setTimeout(resolve, duration))
const loaded = async tab => {
    await pause(500)
    if(tab.document.readyState == 'complete') return
    return new Promise(resolve => tab.onload = resolve)
}

const expect = terms => ({toGoTo: async target => {
    document.body.click()
    const url = new URL('https://www.google.com/search')
    url.searchParams.set('q', 'mdn ' + terms)
    const tab = window.open(url.href, '_blank')
    if(!tab)
        return console.log(`%cCould not open tab for ${terms}.`, 'color: tomato')
    await loaded(tab)
    const result = tab.location.href
    if(result.includes(target))
        console.log(`%cpassed: "${terms}"`, 'color: limegreen')
    else
        console.log(`%cfailed: "${terms}" (got ${result})`, 'color: tomato')
    tab.close()
    await pause(500)
}})



await expect('shadowroot').toGoTo('/en-US/docs/Web/API/ShadowRoot')
await expect('mutationobserver').toGoTo('/en-US/docs/Web/API/MutationObserver')
await expect('forEach').toGoTo('/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach')
await expect('delegatesFocus').toGoTo('/en-US/docs/Web/API/ShadowRoot/delegatesFocus')
await expect('link').toGoTo('/en-US/docs/Web/HTML/Element/link')
await expect('autocomplete').toGoTo('/en-US/docs/Web/HTML/Attributes/autocomplete')
await expect('insertbefore').toGoTo('/en-US/docs/Web/API/Node/insertBefore')
await expect('portal').toGoTo('/en-US/docs/Web/HTML/Element/portal')

console.log('--------------------------------')
console.log('that was it!')
