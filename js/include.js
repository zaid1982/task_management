$('.includeHtml').each(function () {
    const divId = $(this).attr('id');
    const typeId = divId.substring(2, 3);
    let type = '';
    if (typeId === 's') {
        type = 'section/';
    } else if (typeId === 'm') {
        type = 'modal/';
    } else if (typeId === 'b') {
        type = 'base/';
    }
    $('#'+divId).load('html/'+type+divId.substring(4)+'.html?' + new Date().valueOf());
});