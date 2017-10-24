/**
 * cuongnh
 * customize select
 */
$.fn.selectctr = function (options) {
    var settings = $.extend({
        arrow: '<span class="input-group-addon" data-toggle="dropdown"><i class="fa fa-angle-down" aria-hidden="true"></i></span>',
        css: null
    }, options);

    return this.each(function () {
        var objroot = this;
        $(this).hide();
        var val = $(this).val();
        var width = $(this).css('width');
        var ctrDiv = document.createElement("div");
        $(ctrDiv).addClass('input-group select-control').css('width', width);
        if(settings.css) $(ctrDiv).css(settings.css);
        // $(ctrDiv).attr('tabindex', 0);
        ctrDiv.innerHTML = '<span data-toggle="dropdown" class="input-group-addon select-val"></span>';
        var selectval = ctrDiv.firstChild;
        var ul = document.createElement("ul");
        $(ul).addClass('dropdown-menu');
        var optgroup = [];
        $(this).find('option').each(function () {
            if(typeof($(this).closest('optgroup').attr('label')) != "undefined" && $.inArray( $(this).closest('optgroup').attr('label'), optgroup) == -1){
                optgroup.push($(this).closest('optgroup').attr('label'));
                var grli = document.createElement("li");
                grli.innerHTML = '<a href="javascript:void(0)"><b>' + $(this).closest('optgroup').attr('label') + '</b></a>';
                $(grli).addClass('opt-group');
                ul.append(grli);
            }

            var li = document.createElement("li");
            var i = '';
            if($(this).attr('iclass')){
                i = '<i class="'+$(this).attr('iclass')+'" style="margin-right:15px;"></i>';
            }
            li.innerHTML = '<a href="javascript:void(0)">' + i + $(this).text() + '</a>';
            $(li).attr('id', $(this).val()).addClass('select-sort-item');
            if (val === $(this).val()) {
                $(li).addClass('active');
                $(selectval).html($(this).text());
            }
            $(li).bind("click", function (e) {
                var vals = $(this).attr('id');
                $(selectval).html($(this).text());
                $(objroot).val(vals).trigger('change');
                $(ul).children('li').each(function () {
                    $(this).removeClass('active');
                    if ($(this).attr('id') === vals) {
                        $(this).addClass('active');
                    }
                });
            });
            ul.append(li);
        });
        ctrDiv.appendChild(ul);
        var template = document.createElement('template');
        template.innerHTML = settings.arrow;
        ctrDiv.appendChild(template.content.firstChild);
        $(this).after(ctrDiv);
    });
};

$.fn.selectval = function (value) {
    $(this).val(value);
    var selectctr = $(this).next();
    selectctr.find('.select-val').html($(this).find("option:selected").text());
    selectctr.find('ul').children('li').each(function () {
        $(this).removeClass('active');
        if ($(this).attr('id') === value) {
            $(this).addClass('active');
        }
    });
};