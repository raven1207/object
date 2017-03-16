Usage

Basic usage

MessageBox("Good job!", "You clicked the button!", "success");// title, message, type
Or pass an object as options, and second parameter as callback:

MessageBox({
  title: 'I\'m a title',
  message: 'I\'m a message',
  type: 'success',
  showCancelButton: true
}, function(action) {
  console.log('callback:', action);
  MessageBox('Clicked: ' + action);
});
Promise based usage

Basic usage

MessageBox({
  title: 'I\'m a title',
  message: 'I\'m a message',
  type: 'success',
  showCancelButton: true
}).then(function(action) {
  console.log('callback:', action);
  MessageBox('Clicked: ' + action);
});
alert

MessageBox.alert(message, title, options);
MessageBox.alert('message').then(function(action) {
  ...
});
confirm

If user press cancel button, then this promise will be rejected.

MessageBox.confirm(message, title, options);
MessageBox.confirm('message').then(function(action) {
  ...
});
prompt

If user press cancel button, then this promise will be rejected.

MessageBox.prompt(message, title, options);
MessageBox.prompt('message').then(function(value, action) {
  ...
});
Options

Option	Description
title	The title of MessageBox.
message	The content of MessageBox.
type	The status type of MessageBox: success, warning, error
showConfirmButton	Boolean(default true) visible of confirm button.
showCancelButton	Boolean(default false) visible of cancel button.
confirmButtonText	The text of confirm button.
confirmButtonPosition	(Default:right) The position of confirm button, default is right.
confirmButtonHighlight	(Default:false) Highlight confirm button if confirmButtonHighlight is true.
cancelButtonText	The text of cancel button.
cancelButtonHighlight	(Default:false) Highlight cancel button if cancelButtonHighlight is true.
confirmButtonClass	Extra className of confirm button.
cancelButtonClass	Extra className of cancel button.
showInput	Boolean(default false) visible of input.
inputValue	value of input.
inputPlaceholder	placeholder of input.
inputPattern	Regexp(default null). validation pattern of input.
inputValidator	validate function of input, if validator return a string, MessageBox will use it as inputErrorMessage.
inputErrorMessage	error message when inputPattern test inputValue failed.
