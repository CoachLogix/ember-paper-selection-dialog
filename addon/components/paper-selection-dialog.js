import Component from '@ember/component';
import RSVP from 'rsvp';
import layout from '../templates/components/paper-selection-dialog';

export default Component.extend({
  layout,
  tagName: '',

  // paper dialog truthy defaults
  focusOnOpen: true,
  escapeToClose: true,

  multiple: false,
  closeOnConfirm: true,

  itemClass: '',

  cancelLabel: 'Cancel',
  confirmLabel: 'OK',
  noOptionsMessage: 'No options.',

  didReceiveAttrs() {
    let promises = [];

    let options = this.get('options') || [];
    if (options && options.then) {
      this.set('loading', true);
      let optPromise = options.then((resolvedOptions) => {
        this.updateOptions(resolvedOptions);
      });
      promises.push(optPromise);
    } else {
      this.updateOptions(options);
    }

    let selected = this.get('selected');
    if (selected && selected.then) {
      this.set('loading', true);
      let selPromise = selected.then((resolvedSelected) => {
        this.updateSelection(resolvedSelected);
      });
      promises.push(selPromise);
    } else {
      this.updateSelection(selected);
    }

    RSVP.all(promises).then(() => {
      this.set('loading', false);
    });
  },

  updateOptions(options) {
    this.set('_options', options);
  },

  updateSelection(selected) {
    let newSelection;
    if (this.get('multiple')) {
      newSelection = (selected || []).slice(0);
    } else {
      newSelection = selected;
    }
    this.set('_selected', newSelection);
  },

  buildSelection(option, selected) {
    let newSelection = (selected || []).slice(0);
    let idx = newSelection.indexOf(option);
    if (idx > -1) {
      newSelection.splice(idx, 1);
    } else {
      newSelection.push(option);
    }
    return newSelection;
  },

  actions: {
    updateSelected(option) {
      let newSelection = this.buildSelection(option, this.get('_selected'));
      this.set('_selected', newSelection);
    },

    confirm() {
      if (this.get('onSelect')) {
        this.get('onSelect')(this.get('_selected'));
      }
      if (this.get('closeOnConfirm')) {
        if (this.get('onClose')) {
          this.get('onClose')();
        }
      }
    },

    close() {
      if (this.get('onClose')) {
        this.get('onClose')();
      }
    }
  }
});
