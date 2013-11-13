// $(function() {
// 	$("#sortable1, #sortable2").sortable({

// dropOnEmpty: true,	
// 		connectWith: ".connectedSortable"
// 	}).disableSelection();
// });

var $j = jQuery.noConflict();
$j(function() {
    $j(".section-holder").sortable({
        connectWith: '.section-holder',
        dropOnEmpty: true,
        axis: 'y',
        zIndex: 1004,
        cursor: 'crosshair',
    });
    $j("#sort_sections").sortable({
        placeholder: "ui-state-highlight",
        connectWith: '.sections',        
        axis: 'y',
        zIndex: 1003,
        cursor: 'crosshair',

    });
});