(function ($) {

  Drupal.behaviors.vboMultipageSelection = {
    attach: function(context, settings) {

      var $form = $('form.vbo-multipage-selection', context);
      if ($form.length) {
        var $summary = $form.find('.vbo-multipage-selection-summary');
        var $remembered = $form.find('#vbo-multipage-selection-ids');
        var inputs = $form.find('input.vbo-select');

        // Get remembered ids.
        var ids = localStorage.vboMultipageSelection ? localStorage.vboMultipageSelection.split(',') : [];

        function showSummary(ids) {
          // Save into hidden input.
          $remembered.val(localStorage.vboMultipageSelection || '');

          // Show number of selected rows.
          if ($summary.length) {
            var text = $summary.data(ids.length == 1 ? 'singular' : 'plural');
            text = Drupal.formatString(text, {"!num": ids.length});
            $summary.html(text);
          }
        }

        // Save and summarize.
        showSummary(ids);

        // Check rememberd checkboxes.
        var selected = inputs.filter(function(i, id) {
          return ids.indexOf(id.value) != -1;
        });
        selected.attr('checked', 1);

        // Listen to current page's checkboxes to persist selections.
        inputs.click(function() {
          var id = this.value;
          var ids = localStorage.vboMultipageSelection ? localStorage.vboMultipageSelection.split(',') : [];
          var i = ids.indexOf(id);

          // Add to list, if it's not in there already.
          if (this.checked) {
            if (i == -1) {
              ids.push(id);
            }
          }
          // Remove from list, if it's in there.
          else {
            if (i != -1) {
              ids.splice(i, 1);
            }
          }

          // Save and summarize.
          localStorage.vboMultipageSelection = ids.join(',');
          showSummary(ids);
        });

        // Forget selection when a VBO action is triggered.
        $form.find('.vbo-action-button').click(function() {
          localStorage.vboMultipageSelection = '';
        });
      }

    }
  };

})(jQuery);
