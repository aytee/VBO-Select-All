(function ($) {

  // Forget previous persistent selection(s).
  // @todo Make this work with batched VBO. Somehow JS can't delete the cookie if it was set
  // in a batch (AJAX?) response. Tested Chrome and Firefox. With batching disabled, it works
  // perfectly.
  document.cookie.replace(/vbomps_clean_(\w+)/g, function(input, id) {
    var localStorageKey = 'vbomps_' + id;
    delete localStorage[localStorageKey];
    document.cookie = input + '=x; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    console.log('FORGOT VBO MPS FOR: ' + id);
  });

  Drupal.behaviors.vboMultipageSelection = {
    attach: function(context, settings) {

      var $form = $('form.vbo-multipage-selection', context);
      if ($form.length) {

        var id = $form.data('vbo-mps-id');
        var localStorageKey = 'vbomps_' + id;
        var $summary = $form.find('.vbo-multipage-selection-summary');
        var $remembered = $form.find('#vbo-multipage-selection-ids');
        var inputs = $form.find('input.vbo-select');

        // Get remembered ids.
        var ids = localStorage[localStorageKey] ? localStorage[localStorageKey].split(',') : [];

        function showSummary(ids) {
          // Save into hidden input.
          $remembered.val(localStorage[localStorageKey] || '');

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
          var ids = localStorage[localStorageKey] ? localStorage[localStorageKey].split(',') : [];
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
          localStorage[localStorageKey] = ids.join(',');
          showSummary(ids);
        });

      } // if $form

    }
  };

})(jQuery);
