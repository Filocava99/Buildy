$(function(){
    $(".build-id-link").click((event)=>onBuildClick(event))
    $(".build-timestamp-link").click((event)=>onBuildClick(event))


    function onBuildClick(event){
        event.preventDefault()
        event.stopPropagation()
        let selector = $(event.target)
        let buildId = selector.data('build-id')
        hideSelectedBuild()
        updateSelectedBuild(buildId)
    }

    function hideSelectedBuild(){
        let selector = $('#selected-build')
        selector.addClass('hidden')
        selector.removeAttr('id')
    }

    function updateSelectedBuild(buildId){
        let selector = $(`.build-content[data-build-id='${buildId}']`)
        selector.removeClass('hidden')
        selector.attr('id', 'selected-build')
    }
})