<template>
  <div class="flow-box">
    <!-- <el-popover
      placement="top"
      width="160"
      v-model="visible">
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
      </div>
    </el-popover> -->
    <div class="view-flow" ref="viewflow"></div>
  </div>
</template>
<script>
import LogicFlow from '@logicflow/core'
import { Menu } from '@logicflow/extension';
import RegisteNode from './registerNode'
import result from './mock'
export default {
  name: 'FlowView',
  props: {
    isChecked: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      lf: null,
      loading: false,
      show: false,
      visible: false,
      currentData: [],
      activeNodeId: [],
      resultNodeIds: []
    }
  },
  mounted() {
    LogicFlow.use(Menu);
    this.lf = new LogicFlow({
      container: this.$refs.viewflow,
      stopScrollGraph: true,
      stopZoomGraph: true,
      adjustEdge: false,
      adjustNodePosition: false,
      hideAnchors: true,
      textEdit: false,
      nodeTextEdit: false,
      edgeTextEdit: false,
      // 静默模式开始
      // isSilentMode: true,
      grid: {
        size: 10,
        visible: true,
        type: 'mesh',
        config: {
          color: '#DCDCDC',  // 设置网格的颜色
        }
      },
      keyboard: { enabled: false },
    })
    RegisteNode(this.lf, this.isChecked) 
    const data = this.filterData(result)
    this.currentData = data
    this.lf.render(data)
    this.initEvent()
  },
  methods: {
    initEvent() {
      // this.lf.on('node:mouseenter', (data) => {
      //   console.log(data);
      //   this.visible = true
      // })
      // this.lf.on('node:mouseleave', () => {
      //   console.log(11);
      // })
      this.lf.on('custom:enable', (data) => {
        this.changeNode(data)
      })
      this.lf.on('custom:disabled', (data) => {
        this.changeNode(data)
      })
    },
    changeNode({ node, type }) {
      const _types = type.split('-')
      const _nodeIds = this.getRelevanceNode(node.id, _types[1])
      if (_types[0] === 'enable') {
        this.resultNodeIds.push(..._nodeIds)
        // this.resultNodeIds = new Set(...this.resultNodeIds)
      }
      _nodeIds.forEach(id => {
        const _node = this.lf.graphModel.nodesMap[id]
        if (_node) {
          _node.model.setProperties(Object.assign(_node.model.properties, { checked: _types[0]}))
        }
      })
    },
    getRelevanceNode(id, type) {
      this.activeNodeId = []
      if (type === 'current') {
        return [id]
      }
      const { edges } = this.currentData
      if (type === 'parent') {
        return edges.filter(edge => edge.targetNodeId === id).map(edge => edge.sourceNodeId)
      }
      if (type === 'children') {
        return edges.filter(edge => edge.sourceNodeId === id).map(edge => edge.targetNodeId)
      }
      if (type === 'parentall' || type === 'childrenall') {
        this.getDeepNode([id], type)
        console.log(this.activeNodeId);
        return [...this.activeNodeId]
      }
    },
    getDeepNode(ids, type) {
      const { edges } = this.currentData
      ids.forEach(id => {
        const _edges = edges.filter(edge => {
          if (type === 'parentall') {
            if (edge.targetNodeId === id) {
              this.activeNodeId.push(edge.sourceNodeId)
              return true
            }
          } else if(type === 'childrenall') {
            if(edge.sourceNodeId === id) {
              this.activeNodeId.push(edge.targetNodeId)
              return true
            }
          }
          return false
        })
        console.log(_edges, this.activeNodeId);
        if (_edges && _edges.length) {
          const _ids = _edges.map(item => {
            if (type === 'parentall') {
              return item .sourceNodeId
            } else {
              return item .targetNodeId
            }
          })
          this.getDeepNode(_ids, type)
        }
      })
    },
    filterData({ nodes, edges }){
      return {
        nodes: nodes.map(item => ({ ...item, type: 'custom-rect'})),
        edges
      }
    }
  }
}
</script>
<style lang="scss">
.flow-box{
  height: 100%;
}
.view-flow {
  height: 100%;
  .lf-menu {
    width: 120px;
    border-radius: 4px;
    .lf-menu-item {
      color: #333;
      text-align: left;
    }
    .lf-menu-item.line {
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
