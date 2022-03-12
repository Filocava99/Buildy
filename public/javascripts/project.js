$(".build-id-link").click(()=>onBuildClick($(this)))
$(".build-timestamp-link").click(()=>onBuildClick($(this)))

function onBuildClick(selector){
    let buildId = selector.attr('data-build-id')
    hideSelectedBuild()
    updateSelectedBuild(buildId)
}

function hideSelectedBuild(){
    let selector = $('#selected-build')
    selector.addClass('hidden')
    selector.removeAttr('id')
}

function updateSelectedBuild(buildId){
    let selector = $(`#build-${buildId}`)
    selector.removeClass('hidden')
    selector.attr('id', 'selected-build')
}