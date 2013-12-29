
$(document).ready(function() {
    $(".section-holder").sortable({
        connectWith: '.section-holder',
        dropOnEmpty: true,
        axis: 'y',
        zIndex: 1004,
        //cursor: 'crosshair',
    });
    $("#sort_sections").sortable({
        placeholder: "ui-state-highlight",
        connectWith: '.sections',        
        axis: 'y',
        zIndex: 1003,
        //cursor: 'crosshair',

    });
});