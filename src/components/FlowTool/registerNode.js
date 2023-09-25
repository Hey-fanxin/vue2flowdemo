import {
  CircleNodeModel,
  CircleNode,
  h,
  RectNode,
  RectNodeModel,
  PolygonNode,
  PolygonNodeModel,
} from '@logicflow/core';

export default function RegisteNode(lf) {
   /**
    * @description 自定义开始元素
    */
  class ApplyNodeModel extends CircleNodeModel {
    constructor(data, graphModel) {
      data.text = {
        value: '开始',
        x: data.x,
        y: data.y + 40,
      }
      super(data, graphModel)
      this.stroke = '#FF6347'
      this.r = 24;
    }  
    setAttributes() {
      const { properties: { isDisabledNode } } = this;
      if (!isDisabledNode) {
        // 单独为非禁用的元素设置菜单。
        this.menu = [{
          text: '执行',
          className: 'lf-menu-start el-icon-switch-button',
          icon: true,
          callback: (node) => {
            this.graphModel.eventCenter.emit('custom:start', node);
          },
        }, {
          text: '编辑',
          className: 'lf-menu-edit el-icon-edit',
          icon: true,
          callback: (node) => {
            // this.graphModel.setElementStateById(node.id, 2);
            this.graphModel.eventCenter.emit('custom:edit', node);
          },
        }, {
          text: '删除',
          className: 'lf-menu-delete el-icon-delete-solid',
          icon: true,
          callback: (node) => {
            this.graphModel.deleteNode(node.id);
            this.graphModel.eventCenter.emit('custom:del', node);
          },
        }];
      }
    }
    getConnectedTargetRules() {
      const rules = super.getConnectedTargetRules();
      const geteWayOnlyAsTarget = {
        message: this.text.value+'节点只能连出，不能连入！',
        validate: (source, target) => {
          let isValid = true;
          if (target) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }
  }
  class ApplyNode extends CircleNode {
    getShape() {
      const {
        x,
        y,
        width,
        height,
        stroke,
        r,
        radius
      } = this.props.model;
      // const style = this.props.model.getNodeStyle();
      return h('g', {},
        [
          h("circle", {
            r: r,
            x,
            y,
            cx: x,
            cy: y,
            stroke: '#fff',
            fill: '#fff',
            radius,
          }),
          h(
            'svg',
            {
              x: x - width / 2,
              y: y - height / 2,
              width,
              height,
              viewBox: "100 140 768 768",
            },
            [
              h('path', {
                fill: stroke,
                d: "M805.5296 323.6352l-281.4464-162.4576a61.44 61.44 0 0 0-59.136 0L183.1424 323.6352c-18.432 10.4448-29.5424 29.9008-29.5424 51.1488v324.9152c0 21.248 11.4688 41.0112 29.5424 51.456l73.7792 42.4448c35.84 17.7152 48.64 17.7152 65.024 17.7152 53.248 0 83.456-32.3584 83.456-87.9616V402.5344a7.8336 7.8336 0 0 0-7.936-7.936H361.984a7.8336 7.8336 0 0 0-7.9872 7.936v320.7168c0 24.6784-25.7024 49.4592-67.4816 28.5184l-77.2096-44.544a9.1648 9.1648 0 0 1-4.5568-7.6288V374.6816c0-3.1744 1.7408-6.2464 4.5568-7.6288l281.088-162.816a9.7792 9.7792 0 0 1 8.7552 0l281.4464 162.5088a8.704 8.704 0 0 1 4.5568 7.6288v324.864a8.8576 8.8576 0 0 1-4.1984 7.68L499.4048 869.376a9.8304 9.8304 0 0 1-8.704 0l-72.3456-42.752c-2.048-1.024-4.864-1.3824-6.9632-0.3584a181.248 181.248 0 0 1-42.3936 19.456c-4.864 1.3824-11.4688 4.1984 2.4064 12.1856l93.9008 55.6544c9.0624 5.2224 19.0976 7.9872 29.5424 7.9872 10.1376-0.3584 20.5824-2.7648 29.2352-8.2944l281.4464-162.4576c18.0736-10.4448 29.5936-29.9008 29.5936-51.2V374.7328c0-20.7872-11.52-40.704-29.5936-51.0464z"
              }),
              h('path', {
                fill: stroke,
                d: "M581.8368 648.192c-74.4448 0-90.8288-18.7904-96.4096-55.7056a7.8848 7.8848 0 0 0-7.936-6.912h-36.5056a7.8336 7.8336 0 0 0-7.9872 7.936c0 47.3088 25.7024 104.0384 148.9408 104.0384l-0.3584-0.3584c89.0368 0 140.1856-35.1232 140.1856-96.3584 0-60.5184-41.0624-76.9024-127.6928-88.3712-87.296-11.4688-96.3584-17.408-96.3584-37.9392 0-16.6912 7.6288-39.3216 72.2944-39.3216 58.112 0 79.36 12.4928 88.0128 51.5072 1.024 3.4816 4.1984 6.2464 7.936 6.2464h36.608c2.048 0 4.5056-0.7168 5.888-2.4064a8.192 8.192 0 0 0 2.048-6.2464c-5.888-67.1744-50.432-98.4576-140.4928-98.4576-80.0256 0-128 33.792-128 90.4704 0 61.5936 47.616 78.6432 124.928 86.272 92.16 9.1136 99.4816 22.6304 99.4816 40.704 0 31.232-25.088 44.9024-84.5824 44.9024z"
              })
            ]
          )
        ],
      );
    }
  }
  lf.register({
    type: 'apply',
    view: ApplyNode,
    model: ApplyNodeModel,
  })
  /**
    * @description 自定义中间过滤矩形元素
    */
  class ApproverNode extends RectNode {
    static extendKey = 'UserTaskNode';
    getLabelShape() {
      const {
        x,
        y,
        width,
        height,
        properties,
      } = this.props.model;
      const { labelColor, approveTypeLabel } = properties;
      return h(
        'text',
        {
          fill: labelColor,
          fontSize: 12,
          x: x - width / 2 + 5,
          y: y - height / 2 + 15,
          width: 50,
          height: 25
        },
        approveTypeLabel,
      );
    }
    getShape() {
      const {
        x,
        y,
        width,
        height,
        radius,
        stroke
      } = this.props.model;
      const style = this.props.model.getNodeStyle();
      return h(
        'g',
        {
        },
        [
          h(
            'rect',
            {
              ...style,
              x: x - width / 2,
              y: y - height / 2,
              rx: radius,
              ry: radius,
              width,
              height,
              stroke
            },
          ),
          this.getLabelShape(),
        ],
      );
    }
  }
  class ApproverModel extends RectNodeModel { 
    constructor(data, graphModel) {
      data.text = {
        value: '过滤节点',
        x: data.x,
        y: data.y + 35,
      }
      super(data, graphModel);
    }
    setAttributes() {
      this.stroke = '#3CB371'
      this.radius = 8;
      this.width = 80;
      this.height = 40;
      const { properties: { isDisabledNode } } = this;
      if (!isDisabledNode) {
        // 单独为非禁用的元素设置菜单。
        this.menu = [{
          text: '编辑',
          className: 'lf-menu-edit el-icon-edit',
          icon: true,
          callback: (node) => {
            // this.graphModel.setElementStateById(node.id, 2);
            this.graphModel.eventCenter.emit('custom:edit', node);
          },
        }, {
          text: '删除',
          className: 'lf-menu-delete el-icon-delete-solid',
          icon: true,
          callback: (node) => {
            this.graphModel.deleteNode(node.id);
            this.graphModel.eventCenter.emit('custom:del', node);
          },
        }];
      }
    }
  }
  lf.register({
    type: 'approver',
    view: ApproverNode,
    model: ApproverModel,
  })
  /**
    * @description 自定义中间过滤棱形元素
    */
  class JugementModel extends PolygonNodeModel { 
    constructor(data, graphModel) {
      data.text = {
        value: '过滤节点',
        x: data.x,
        y: data.y + 45,
      }
      super(data, graphModel);
      this.points= [
        [35, 0],
        [70, 35],
        [35, 70],
        [0, 35],
      ];
    }
    setAttributes() {
      this.stroke = '#6495ED';
      const { properties: { isDisabledNode } } = this;
      if (!isDisabledNode) {
        // 单独为非禁用的元素设置菜单。
        this.menu = [{
          text: '编辑',
          className: 'lf-menu-edit el-icon-edit',
          icon: true,
          callback: (node) => {
            // this.graphModel.setElementStateById(node.id, 2);
            this.graphModel.eventCenter.emit('custom:edit', node);
          },
        }, {
          text: '删除',
          className: 'lf-menu-delete el-icon-delete-solid',
          icon: true,
          callback: (node) => {
            this.graphModel.deleteNode(node.id);
            this.graphModel.eventCenter.emit('custom:del', node);
          },
        }];
      }
    }
  }
  lf.register({
    type: 'jugement',
    view: PolygonNode,
    model: JugementModel,
  });
  /**
    * @description 自定义结束元素
    */
  class FinshNodeModel extends CircleNodeModel {
    constructor(data, graphModel) {
      data.text = {
        value: '结束',
        x: data.x,
        y: data.y + 40,
      }
      super(data, graphModel)
    } 
    setAttributes() {
      this.stroke = '#FF6347'
      this.r = 24;
      const { properties: { isDisabledNode } } = this;
      if (!isDisabledNode) {
        // 单独为非禁用的元素设置菜单。
        this.menu = [{
          text: '编辑',
          className: 'lf-menu-edit el-icon-edit',
          icon: true,
          callback: (node) => {
            // this.graphModel.setElementStateById(node.id, 2);
            this.graphModel.eventCenter.emit('custom:edit', node);
          },
        }, {
          text: '删除',
          className: 'lf-menu-delete el-icon-delete-solid',
          icon: true,
          callback: (node) => {
            this.graphModel.deleteNode(node.id);
            this.graphModel.eventCenter.emit('custom:del', node);
          },
        }];
      }
    }
    getConnectedSourceRules() {
      const rules = super.getConnectedSourceRules();
      const geteWayOnlyAsTarget = {
        message: this.text.value+'节点只能连入，不能连出！',
        validate: (source) => {
          let isValid = true;
          if (source) {
            isValid = false;
          }
          return isValid;
        },
      };
      // @ts-ignore
      rules.push(geteWayOnlyAsTarget);
      return rules;
    }
  }
  lf.register({
    type: 'finsh',
    view: CircleNode,
    model: FinshNodeModel,
  })
}