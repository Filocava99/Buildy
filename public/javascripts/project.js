$(function(){
    $(".build-id-link").click((element)=>onBuildClick($(element.target)))
    $(".build-timestamp-link").click((element)=>onBuildClick($(element.target)))


    function onBuildClick(selector){
        console.log("triggered")
        let buildId = selector.data('build-id')
        console.log(buildId)
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