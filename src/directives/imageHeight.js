import {
  IMAGE_WIDTH_HEIGHT_RATIO
} from '../config/config';
export default {
  acceptStatement: true,
  update: function(imgWidth) {
    this.el.style.height =imgWidth?
    imgWidth / IMAGE_WIDTH_HEIGHT_RATIO + 'px':
    'auto';
  }
}
