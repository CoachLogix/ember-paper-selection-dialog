import RSVP from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | paper selection dialog', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders the correct title', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{paper-selection-dialog title="some title"}}
    `);

    return settled().then(() => {
      assert.dom('h2').hasText('some title', 'rendered correct title');
    });
  });

  test('it renders `cancelLabel` if provided', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{paper-selection-dialog cancelLabel="a cancel label"}}
    `);


    assert.dom('.md-button:nth-child(1)').hasText('a cancel label', 'rendered cancel label');
  });

  test('it renders `confirmLabel` if provided', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{paper-selection-dialog confirmLabel="a confirm label"}}
    `);

    assert.dom('.md-button:nth-child(2)').hasText('a confirm label', 'rendered confirm label');
  });

  let numbers = [1, 2, 3];

  test('it renders the correct options (single mode)', async function(assert) {
    assert.expect(5);

    this.options = numbers;

    await render(hbs`
      {{#paper-selection-dialog options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-list-item').exists({ count: 3 }, 'rendered 3 options');
    assert.dom('md-radio-button').exists({ count: 3 }, 'rendered 3 radio buttons');

    numbers.forEach((item, i) => {
      assert.dom(`md-list-item:nth-child(${i + 1})`).hasText(`${item}`, `rendered the correct text for option ${item}`);
    });
  });

  test('it renders the correct options (multiple mode)', async function(assert) {
    assert.expect(5);

    this.options = numbers;

    await render(hbs`
      {{#paper-selection-dialog multiple=true options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-list-item').exists({ count: 3 }, 'rendered 3 options');
    assert.dom('md-checkbox').exists({ count: 3 }, 'rendered 3 radio buttons');

    numbers.forEach((item, i) => {
      assert.dom(`md-list-item:nth-child(${i + 1})`).hasText(`${item}`, `rendered the correct text for option ${item}`);
    });
  });

  test('it supports promises as options', async function(assert) {
    assert.expect(4);

    this.options = RSVP.Promise.resolve(numbers);

    await render(hbs`
      {{#paper-selection-dialog options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-list-item').exists({ count: 3 }, 'rendered 3 options');

    numbers.forEach((item, i) => {
      assert.dom(`md-list-item:nth-child(${i + 1})`).hasText(`${item}`, `rendered the correct text for option ${item}`);
    });
  });

  test('it displays a loading indicator while options promise doesn\'t resolve', async function(assert) {
    assert.expect(2);

    this.options = new RSVP.Promise(() => { });

    await render(hbs`
      {{#paper-selection-dialog options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-list-item').doesNotExist('no options were rendered');
    assert.dom('md-progress-circular').exists({ count: 1 }, 'a progress circular was rendered');
  });

  test('it displays a loading indicator while selected promise doesn\'t resolve', async function(assert) {
    assert.expect(2);

    this.options = numbers;
    this.selected = new RSVP.Promise(() => { });

    await render(hbs`
      {{#paper-selection-dialog selected=selected options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-list-item').doesNotExist('no options were rendered');
    assert.dom('md-progress-circular').exists({ count: 1 }, 'a progress circular was rendered');
  });

  test('selecting an option doesn\'t mutate the `selected` property (single mode)', async function(assert) {
    assert.expect(2);

    this.options = numbers;
    this.selected = 3;

    await render(hbs`
      {{#paper-selection-dialog selected=selected options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.equal(this.selected, 3, 'selected is 3');

    // click option 1
    await click(findAll('md-radio-button')[0]);
    assert.equal(this.selected, 3, 'selected didn\'t change (is still 3)');
  });

  test('selecting an option doesn\'t mutate the `selected` property (multiple mode)', async function(assert) {
    assert.expect(2);

    this.options = numbers;
    this.selected = [3];

    await render(hbs`
      {{#paper-selection-dialog multiple=true selected=selected options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.deepEqual(this.selected, [3], 'selected is [3]');

    // click option 1
    await click(findAll('md-checkbox')[0]);
    assert.deepEqual(this.selected, [3], 'selected didn\'t change (is still [3])');
  });

  test('selecting an option and pressing confirm button triggers an action with the new selection (single mode)', async function(assert) {
    assert.expect(1);

    this.options = numbers;
    this.onSelect = (selection) => {
      assert.equal(selection, 1, 'selection is 1');
    };

    await render(hbs`
      {{#paper-selection-dialog selected=selected options=options onSelect=(action onSelect) as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    // click option 1
    await click(findAll('md-radio-button')[0]);

    // click confirm button
    await click(findAll('.md-button')[1]);
  });

  test('selecting an option and pressing confirm button sends an action with the new selection (multiple mode)', async function(assert) {
    assert.expect(1);

    this.options = numbers;
    this.onSelect = (selection) => {
      assert.deepEqual(selection, [1, 2], 'selection is [1, 2]');
    };

    await render(hbs`
      {{#paper-selection-dialog multiple=true selected=selected options=options onSelect=(action onSelect) as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    // click option 1 and 2
    await click(findAll('md-checkbox')[0]);
    await click(findAll('md-checkbox')[1]);

    // click confirm button
    await click(findAll('.md-button')[1]);
  });

  test('shows correct option selected (single mode)', async function(assert) {
    assert.expect(2);

    this.options = numbers;
    this.selected = 3;

    await render(hbs`
      {{#paper-selection-dialog selected=selected options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-radio-button.md-checked').exists({ count: 1 }, 'one radio button is checked');
    assert.dom(findAll('md-radio-button.md-checked')[0].parentNode).hasText('3', 'and it is the correct one');
  });

  test('shows correct options selected (multiple mode)', async function(assert) {
    assert.expect(3);

    this.options = numbers;
    this.selected = [2, 3];

    await render(hbs`
      {{#paper-selection-dialog multiple=true selected=selected options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-checkbox.md-checked').exists({ count: 2 }, 'two checkboxes are checked');

    this.selected.forEach((item, i) => {
      assert.dom(findAll('md-checkbox.md-checked')[i].parentNode).hasText(`${item}`, `${item} is selected`);
    });
  });

  test('pressing cancel button sends `onClose` action', async function(assert) {
    assert.expect(1);

    this.options = numbers;
    this.onClose = () => {
      assert.ok(true);
    };

    await render(hbs`
      {{#paper-selection-dialog onClose=(action onClose) as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    click('.md-button');
  });

  test('can specify paper-item class using `itemClass` property', async function(assert) {
    assert.expect(1);

    this.options = numbers;

    await render(hbs`
      {{#paper-selection-dialog options=options itemClass="some-class" as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('.some-class').exists({ count: 3 }, 'rendered 3 options with custom class');
  });

  test('it renders a default message if options are empty', async function(assert) {
    assert.expect(3);

    this.options = [];

    await render(hbs`
      {{#paper-selection-dialog options=options as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-list-item').exists({ count: 1 }, 'rendered 1 item');
    assert.dom('md-radio-button').doesNotExist('rendered 0 radio buttons');
    assert.dom('.selection-dialog--no-options').hasText('No options.');
  });

  test('it renders a custom message if options are empty', async function(assert) {
    assert.expect(3);

    this.options = [];

    await render(hbs`
      {{#paper-selection-dialog options=options noOptionsMessage="no options, mate" as |option|}}
        {{option}}
      {{/paper-selection-dialog}}
    `);

    assert.dom('md-list-item').exists({ count: 1 }, 'rendered 1 item');
    assert.dom('md-radio-button').doesNotExist('rendered 0 radio buttons');
    assert.dom('.selection-dialog--no-options').hasText('no options, mate');
  });
});
