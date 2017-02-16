import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

const { RSVP } = Ember;

moduleForComponent('paper-selection-dialog', 'Integration | Component | paper selection dialog', {
  integration: true
});

test('it renders the correct title', function(assert) {
  assert.expect(1);

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{paper-selection-dialog title="some title"}}
  `);

  return wait().then(() => {
    assert.equal(this.$('h2').text().trim(), 'some title', 'rendered correct title');
  });
});

test('it renders `cancelLabel` if provided', function(assert) {
  assert.expect(1);

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{paper-selection-dialog cancelLabel="a cancel label"}}
  `);

  return wait().then(() => {
    assert.equal(this.$('.md-button').eq(0).text().trim(), 'a cancel label', 'rendered cancel label');
  });
});

test('it renders `confirmLabel` if provided', function(assert) {
  assert.expect(1);

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{paper-selection-dialog confirmLabel="a confirm label"}}
  `);

  return wait().then(() => {
    assert.equal(this.$('.md-button').last().text().trim(), 'a confirm label', 'rendered confirm label');
  });
});

let numbers = [1, 2, 3];

test('it renders the correct options (single mode)', function(assert) {
  assert.expect(5);

  this.options = numbers;

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    let listItems = this.$('md-list-item');

    assert.equal(listItems.length, 3, 'rendered 3 options');
    assert.equal(this.$('md-radio-button').length, 3, 'rendered 3 radio buttons');

    numbers.forEach((item, i) => {
      assert.equal(listItems.eq(i).text().trim(), item, `rendered the correct text for option ${item}`);
    });

  });
});

test('it renders the correct options (multiple mode)', function(assert) {
  assert.expect(5);

  this.options = numbers;

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog multiple=true options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    let listItems = this.$('md-list-item');

    assert.equal(listItems.length, 3, 'rendered 3 options');
    assert.equal(this.$('md-checkbox').length, 3, 'rendered 3 radio buttons');

    numbers.forEach((item, i) => {
      assert.equal(listItems.eq(i).text().trim(), item, `rendered the correct text for option ${item}`);
    });

  });
});

test('it supports promises as options', function(assert) {
  assert.expect(4);

  this.options = RSVP.Promise.resolve(numbers);

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    let listItems = this.$('md-list-item');

    assert.equal(listItems.length, 3, 'rendered 3 options');

    numbers.forEach((item, i) => {
      assert.equal(listItems.eq(i).text().trim(), item, `rendered the correct text for option ${item}`);
    });

  });
});

test('it displays a loading indicator while options promise doesn\'t resolve', function(assert) {
  assert.expect(2);

  this.options = new RSVP.Promise(() => { });

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    let listItems = this.$('md-list-item');

    assert.equal(listItems.length, 0, 'no options were rendered');
    assert.equal(this.$('md-progress-circular').length, 1, 'a progress circular was rendered');
  });
});

test('it displays a loading indicator while selected promise doesn\'t resolve', function(assert) {
  assert.expect(2);

  this.options = numbers;
  this.selected = new RSVP.Promise(() => { });

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog selected=selected options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    let listItems = this.$('md-list-item');

    assert.equal(listItems.length, 0, 'no options were rendered');
    assert.equal(this.$('md-progress-circular').length, 1, 'a progress circular was rendered');
  });
});

test('selecting an option doesn\'t mutate the `selected` property (single mode)', function(assert) {
  assert.expect(2);

  this.options = numbers;
  this.selected = 3;

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog selected=selected options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  assert.equal(this.selected, 3, 'selected is 3');

  return wait().then(() => {
    // click option 1
    this.$('md-radio-button').eq(0).click();
    assert.equal(this.selected, 3, 'selected didn\'t change (is still 3)');
  });
});

test('selecting an option doesn\'t mutate the `selected` property (multiple mode)', function(assert) {
  assert.expect(2);

  this.options = numbers;
  this.selected = [3];

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog multiple=true selected=selected options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  assert.deepEqual(this.selected, [3], 'selected is [3]');

  return wait().then(() => {
    // click option 1
    this.$('md-checkbox').eq(0).click();
    assert.deepEqual(this.selected, [3], 'selected didn\'t change (is still [3])');
  });
});

test('selecting an option and pressing confirm button triggers an action with the new selection (single mode)', function(assert) {
  assert.expect(1);

  this.options = numbers;
  this.onSelect = (selection) => {
    assert.equal(selection, 1, 'selection is 1');
  };

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog selected=selected options=options onSelect=(action onSelect) as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    // click option 1
    this.$('md-radio-button').eq(0).click();

    // click confirm button
    this.$('.md-button').last().click();
  });
});

test('selecting an option and pressing confirm button sends an action with the new selection (multiple mode)', function(assert) {
  assert.expect(1);

  this.options = numbers;
  this.onSelect = (selection) => {
    assert.deepEqual(selection, [1, 2], 'selection is [1, 2]');
  };

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog multiple=true selected=selected options=options onSelect=(action onSelect) as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    // click option 1 and 2
    this.$('md-checkbox').eq(0).click();
    this.$('md-checkbox').eq(1).click();

    // click confirm button
    this.$('.md-button').last().click();
  });
});

test('shows correct option selected (single mode)', function(assert) {
  assert.expect(2);

  this.options = numbers;
  this.selected = 3;

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog selected=selected options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    let selectedRadio = this.$('md-radio-button.md-checked');

    assert.equal(selectedRadio.length, 1, 'one radio button is checked');
    assert.equal(selectedRadio.parentsUntil('md-list-item').text().trim(), '3', 'and it is the correct one');
  });
});

test('shows correct options selected (multiple mode)', function(assert) {
  assert.expect(3);

  this.options = numbers;
  this.selected = [2, 3];

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog multiple=true selected=selected options=options as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    let selectedCheckboxes = this.$('md-checkbox.md-checked');

    assert.equal(selectedCheckboxes.length, 2, 'two checkboxes are checked');

    this.selected.forEach((item, i) => {
      assert.equal(selectedCheckboxes.eq(i).parentsUntil('md-list-item').text().trim(), item, `${item} is selected`);
    });
  });
});

test('pressing cancel button sends `onClose` action', function(assert) {
  assert.expect(1);

  this.options = numbers;
  this.onClose = () => {
    assert.ok(true);
  };

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog onClose=(action onClose) as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    this.$('.md-button').eq(0).click();
  });
});

test('can specify paper-item class using `itemClass` property', function(assert) {
  assert.expect(1);

  this.options = numbers;

  this.render(hbs`
    <div id="paper-wormhole"></div>
    {{#paper-selection-dialog options=options itemClass="some-class" as |option|}}
      {{option}}
    {{/paper-selection-dialog}}
  `);

  return wait().then(() => {
    assert.equal(this.$('.some-class').length, 3, 'rendered 3 options with custom class');
  });
});

