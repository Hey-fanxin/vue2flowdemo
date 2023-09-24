<template>
  <div class="approve-example-container">
    <div class="node-panel">
      <div v-for="(item, key) in approveNodes" :key="key" :class="`approve-node node-${item.type}`">
        <div
            class="node-shape"
            :style="item.style"
            @mousedown="dragNode(item)"
          ></div>
          <div class="node-label">{{ item.label }}</div>
      </div>
    </div>
    <div class="viewport" ref="flowel"></div>
    <el-drawer title="属性面板" :visible.sync="show">
      <div class="from-content">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="节点名称" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import LogicFlow from '@logicflow/core'
import { Menu } from '@logicflow/extension';
import RegisteNode from './registerNode'
import { themeApprove, approveNodes } from './config'
export default {
  name: 'FlowTool',
  data() {
    return {
      lf: null,
      approveNodes,
      activeNodeId: '',
      form: {
        title: '',
        name: '',
        region: ''
      },
      show: false,
      loading: false
    }
  },
  mounted() {
    LogicFlow.use(Menu);
    this.lf = new LogicFlow({
      container: this.$refs.flowel,
      stopScrollGraph: true,
      stopZoomGraph: true,
      grid: {
        size: 10,
        visible: true,
        type: 'mesh',
        config: {
          color: '#DCDCDC',  // 设置网格的颜色
        }
      },
      keyboard: { enabled: true },
      style: themeApprove
    })
    RegisteNode(this.lf)
    this.lf.render()
    this.initEvent()
  },
  methods: {
    initEvent() {
      this.lf.on('connection:not-allowed', ({ msg }) => {
        this.$message.error(msg);
      }),
      this.lf.on('custom:start', (data) => {
        this.form = Object.assign({}, { title: data.text.value, ...data.properties})
      });
      this.lf.on('custom:edit', (data) => {
        console.log(data);
        this.activeNodeId = data.id
        this.form = Object.assign({}, { ...data.properties, title: data.text.value })
        this.show = true
      });
    },
    updateProperty(id, data) {
      const node = this.lf.graphModel.nodesMap[id]
      const edge = this.lf.graphModel.edgesMap[id]
      if (node) {
        node.model.setProperties(Object.assign(node.model.properties, data))
        node.model.updateText(data.title)
      } else if (edge) {
        edge.model.setProperties(Object.assign(edge.model.properties, data))
      }
    },
    dragNode(item) {
      if (this.lf) {
        this.lf.dnd.startDrag({
          type: item.type,
          text: item.label,
          properties: item.properties
        })
      }
    },
    onSubmit() {
      this.$refs.form.validate(visible => {
        if (visible) {
          this.loading = true
          setTimeout(() => {
            this.updateProperty(this.activeNodeId, { ...this.form })
            this.show = false
            this.loading = false
          }, 1000)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.approve-example-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .node-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    padding: 20px 10px;
    background-color: white;
    box-shadow: 0 0 10px 1px rgb(228, 224, 219);
    border-radius: 6px;
    text-align: center;
    z-index: 101;
    .approve-node {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    }
    .node-label {
      font-size: 12px;
      margin-top: 8px;
    }
    .node-jugement .node-label {
      margin-top: 15px;
    }
  }
}
.viewport {
  height: 100%;
  .lf-menu {
    width: 70px;
    border-radius: 4px;
    .lf-menu-item {
      color: #333;
    }
    .lf-menu-start::before {
      color: rgb(14, 127, 240);
    }
    .lf-menu-edit::before {
      color: rgb(21, 240, 14);
    }
    .lf-menu-delete::before {
      color: rgb(243, 43, 24);
    }
    .lf-menu-item-icon{
      display: inline-block;
      width: 6px;
      height: 6px;
    }
  }
}
.from-content {
  padding: 20px;
  text-align: left;
}
</style>
