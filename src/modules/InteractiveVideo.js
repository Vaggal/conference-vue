import interact from 'interactjs';

function onDragMove(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0);
  var y = (parseFloat(target.getAttribute('data-y')) || 0);

  x += event.dx;
  y += event.dy;

  event.target.style.webkitTransform = event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function onResizeMove(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0);
  var y = (parseFloat(target.getAttribute('data-y')) || 0);

  // update the element's style
  target.style.width = event.rect.width + 'px';
  target.style.height = event.rect.height + 'px';

  // translate when resizing from top or left edges
  x += event.deltaRect.left;
  y += event.deltaRect.top;
  target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

let setup = function (videoLocalElement) {
  interact(videoLocalElement)
    .draggable({
      inertia: true,
      restrict: {
        restriction: 'parent',
        endOnly: true,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1
        }
      },
      onmove: window.dragMoveListener
    }).resizable({
      preserveAspectRatio: true,
      inertia: true,
      edges: {
        left: true,
        right: true,
        bottom: true,
        top: true
      },
      restrictEdges: {
        outer: 'parent',
        endOnly: true,
      },
      restrictSize: {
        min: {
          width: 100,
          height: 100
        },
      }
    })
    .on('dragmove', onDragMove)
    .on('resizemove', onResizeMove);
}

export default {
  setup: setup
};
