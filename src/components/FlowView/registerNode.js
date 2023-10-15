import {
  h,
  RectNode,
  RectNodeModel,
} from '@logicflow/core';

export default function RegisteNode(lf, isChecked) {

  class ApproverNode extends RectNode {
    getShape() {
      const {
        x,
        y,
        width,
        height,
        radius,
        properties,
      } = this.props.model;
      const style = this.props.model.getNodeStyle();
      return h('g', {}, [
        h('rect', {
          ...style,
          x: x - width / 2,
          y: y - height / 2,
          rx: radius,
          ry: radius,
          width,
          height,
          stroke: properties.checked === 'enable' ? '#3CB371' : '#ccc'
        })]
      );
    }
  }
  class ApproverModel extends RectNodeModel { 
    constructor(data, graphModel) {
      super(data, graphModel);
    }
    setAttributes() {
      this.radius = 8;
      this.height = 30;
      if (isChecked) {
        // 单独为非禁用的元素设置菜单。
        this.menu = [{
          text: '选中-父级',
          className: 'lf-menu-enable',
          icon: false,
          callback: (node) => {
            // this.graphModel.setElementStateById(node.id, 2);
            this.graphModel.eventCenter.emit('custom:enable', { node, type: 'enable-parent'});
          },
        }, {
          text: '选中-所以父级',
          className: 'lf-menu-enable',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:enable', { node, type: 'enable-parentall'});
          },
        }, {
          text: '选中-自己',
          className: 'lf-menu-enable',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:enable', { node, type: 'enable-current'});
          },
        },  {
          text: '选中-子级',
          className: 'lf-menu-enable',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:enable', { node, type: 'enable-children'});
          },
        },  {
          text: '选中-所有子级',
          className: 'lf-menu-enable line',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:enable', { node, type: 'enable-childrenall'});
          },
        }, {
          text: '禁用-父级',
          className: 'lf-menu-disabled',
          icon: false,
          callback: (node) => {
            // this.graphModel.setElementStateById(node.id, 2);
            this.graphModel.eventCenter.emit('custom:disabled', { node, type: 'disabled-parent'});
          },
        }, {
          text: '禁用-所以父级',
          className: 'lf-menu-disabled',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:disabled', { node, type: 'disabled-parentall'});
          },
        }, {
          text: '禁用-自己',
          className: 'lf-menu-disabled',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:disabled', { node, type: 'disabled-current'});
          },
        },  {
          text: '禁用-子级',
          className: 'lf-menu-disabled',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:disabled', { node, type: 'disabled-children'});
          },
        },  {
          text: '禁用-所有子级',
          className: 'lf-menu-disabled',
          icon: false,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:disabled', { node, type: 'disabled-childrenall'});
          },
        }];
      } else {
        this.menu = []
      }
    }
    getTextStyle() {
      const style = super.getTextStyle()
      const properties = this.getProperties()
      style.color = properties.checked === 'enable' ? '#3CB371' : '#ccc'
      style.overflowMode = 'hidden'
      return style
    }
  }
  lf.register({
    type: 'custom-rect',
    view: ApproverNode,
    model: ApproverModel,
  })
}