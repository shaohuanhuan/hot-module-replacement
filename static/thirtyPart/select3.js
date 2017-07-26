(function($) {
    $.fn.select3 = function() {
        $(this).each(function(index, el) {
            var $this = $(el),
                numberOfOptions = $(this).children('option').length;

            $this.find('option:eq(0)').attr('selected', true); // by shaohuan
            $this.addClass('select3-hidden');
            $this.wrap('<div class="select3"></div>');
            $this.after('<div class="select3-styled"><span></span><i class="theme-icon icon-chevron-up chevron-up"/><i class="theme-icon icon-chevron-down chevron-down" /></div>');

            var $styledSelect = $this.next('div.select3-styled');
            $styledSelect.find('span').text($this.children('option').eq(0).text());

            var $list = $('<ul />', {
                'class': 'select3-options'
            }).insertAfter($styledSelect);

            for (var i = 0; i < numberOfOptions; i++) {
                $('<li />', {
                    text: $this.children('option').eq(i).text(),
                    rel: $this.children('option').eq(i).val(),
                    title: $this.children('option').eq(i).text()
                }).appendTo($list);
            }

            var $listItems = $list.children('li');

            $styledSelect.click(function(e) {
                e.stopPropagation();
                $('div.select3-styled.active').not(this).each(function() {
                    $(this).removeClass('active').next('ul.select3-options').hide();
                });
                $(this).toggleClass('active').next('ul.select3-options').toggle();
            });

            $listItems.click(function(e) {
                e.stopPropagation();
                $styledSelect.find('span').text($(this).text()).removeClass('active');
                $this.val($(this).attr('rel'));
                $(this).siblings('li').removeClass('selected')
                $(this).addClass('selected')
                $list.hide();
                // by shaohuan
                $this.find('option').attr('selected', false)
                $this.find('option[value=' + $(this).attr('rel') + ']').attr('selected', true)
                $this.trigger('change')
            });

            $(document).click(function() {
                $styledSelect.removeClass('active');
                $list.hide();
            });
        });
    }

    $("select.ui-select").select3();

})(jQuery);
