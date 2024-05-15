export default function getClientMouse() { // gets user selected colors and mouse coordinates
  const coordinates = $('#coordinates').text();
  const [x, y] = coordinates.split(',').map(coord => parseInt(coord.trim()));
  const selectedcolor = $('#palette-buttons a.selected').data('id'); 
  return [x, y, selectedcolor]
}