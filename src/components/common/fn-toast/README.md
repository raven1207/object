Usage

Basically you can pass a string to Toast:

Toast('Upload Completed');

Or invoke Toast with an object as its configuration:

Toast({
  message: 'Upload Completed',
  position: 'bottom',
  duration: 5000
});

API

Option	     Description	Value	Default
message	     content of the toast
position	location of the toast relative to viewport	'top' 'bottom' 'middle'	'middle'
duration	time before the toast vanishes, in millisecond		3000
className	custom class name of the toast
iconClass	class name of the optional icon font
