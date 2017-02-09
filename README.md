# ember-paper-selection-dialog [![Build Status](https://travis-ci.org/CoachLogix/ember-paper-selection-dialog.svg?branch=master)](https://travis-ci.org/CoachLogix/ember-paper-selection-dialog)

This is an [ember-paper](https://github.com/miguelcobain/ember-paper) addon that provides dialogs for selections. Think of it as a select component, but using dialogs.

## Usage

An example usage:

```hbs
{{#paper-selection-dialog
  title="Select a country" class="flex-50" fullscreen=true
  options=options selected=singleSelected
  onSelect=(action (mut singleSelected)) onClose=(action (mut showSingle) false) as |option index selected|}}
  {{option}} {{if selected "Yay, I'm selected"}} #{{index}}
{{/paper-selection-dialog}}
```

The component is promise friendly, meaning that it accepts promises in `options` or `selected` properties and will display a `{{paper-circular-progress}}` until both are resolved.

You must specify how you want to render each item in the component's block. Each option is yielded to the block, along with its index. A boolean is also yielded to let you know if that option is currently selected or not.

## Demo

You can see how this addon looks like at https://coachlogix.github.io/ember-paper-selection-dialog/

## Installation

Run:

```bash
ember install ember-paper-selection-dialog
```

## API

- All the properties that `paper-dialog` supports.
- `multiple` - defaults to `false` - set it to `true` to support multiple selections.
- `options` - an array or promise that resolves to an array that contains the possible options to choose from.
- `selected` - the currently selected items. Can also be a promise.
- `onSelect` - an action sent when the user clicks the confirm button. Will contain an option on single mode and an array of options on multiple mode.
- `onClose` - an action sent when the cancel or close button are pressed (also sent every time `paper-dialog` sends it)
- `cancelLabel` - defaults to `'Cancel'` - you can specify an alternate text for the cancel button
- `confirmLabel` - defaults to `'Confirm'` - you can specify an alternate text for the confirm button
- `title` - the displayed title of the dialog
- `closeOnConfirm` - defaults to `true` - by default the component will also send the `onClose` action when you click the confirm button

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
