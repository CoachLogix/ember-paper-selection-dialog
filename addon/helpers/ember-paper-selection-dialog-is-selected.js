import { isEqual } from '@ember/utils';
import { isArray } from '@ember/array';
import Helper from '@ember/component/helper';
import { observer } from '@ember/object';

export default Helper.extend({
  compute([option, selected]) {
    if (selected === undefined || selected === null) {
      return false;
    }
    if (isArray(selected)) {
      this.set('array', selected);
      for (let i = 0; i < selected.length; i++) {
        if (isEqual(selected[i], option)) {
          return true;
        }
      }
      return false;
    } else {
      return isEqual(option, selected);
    }
  },

  arrayContentDidChange: observer('array.[]', function() {
    this.recompute();
  })
});