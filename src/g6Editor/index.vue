<template>
  <div class="root">
    <div
      :class="{ 'visualized-container': true, 'full-screen': isFullScreen }"
      @click="closeContextmenu"
    >
      <!-- g6容器 -->
      <div
        id="g6-container"
        class="editor-container"
        @dragover="dragoverHandler"
        @drop="dropHandler"
        @contextmenu="preventContextmenu"
      >
        <!-- 工具条 -->
        <Toolbar
          :toolbal-event.sync="toolbalEvent"
        />

        <!-- 右键菜单 -->
        <ContextMenu
          v-show="showContextmenu"
          :context-type="contextType"
          :style="contextmenuPos"
          :context-event.sync="contextEvent"
        />
      </div>

      <!-- 左侧树节点 -->
      <ItemPanel v-show="!isFullScreen" />
    </div>
  </div>
</template>

<script>
import uniqueId from 'lodash/uniqueId';
import G6 from '@antv/g6';
import ContextMenu from './components/contextMenu.vue';
import ItemPanel from './components/itemPanel.vue';
import Toolbar from './components/toolbar.vue';
import itemList from './constantConfig/itemList';
import customNode from './baseConfig/customNode';
import behaviors from './behavior';
import customEdge from './baseConfig/customEdge';
import eventBus from './utils/eventBus';

export default {
  name: 'Editor',
  components: {
    ContextMenu,
    ItemPanel,
    Toolbar,
  },
  data() {
    return {
      operatoryList: null,

      graph: null,
      graphData: {
        nodes: [
          {
            id: 'node1',
            inPoints: [[0.5, 0]],
            label: '节点1',
            outPoints: [[0.5, 1]],
            type: 'customNode',
            x: 427,
            y: 239,
            anchorPoints: [
              [0.5, 0],
              [0.5, 1],
            ],
          },
          {
            id: 'node2',
            inPoints: [[0.5, 0]],
            label: '节点1',
            outPoints: [[0.5, 1]],
            type: 'customNode',
            x: 627,
            y: 339,
            anchorPoints: [
              [0.5, 0],
              [0.5, 1],
            ],
          },
        ],
        edges: [
          {
            id: 'edge2',
            source: 'node1',
            sourceAnchor: 1,
            target: 'node2',
            targetAnchor: 0,
            type: 'customEdge',
          },
        ],
      }, // 复现时从服务器取数据

      currentNode: null,
      currentEdge: null,

      showContextmenu: false,
      contextEvent: '',
      contextType: '',
      contextmenuPos: {
        left: '0',
        top: '0',
      },

      isFullScreen: false,
      toolbalEvent: '',
    };
  },
  watch: {
    contextEvent(newValue) {
      if (newValue === '') {
        return;
      }
      switch (newValue) {
        case 'removeNode':
          this.graph.removeItem(this.currentNode);
          break;
        case 'removeEdge':
          this.graph.removeItem(this.currentEdge);
          break;
        default:
          break;
      }
      this.contextEvent = '';
    },
    toolbalEvent(newValue) {
      if (newValue === '') {
        return;
      }
      switch (newValue) {
        case 'fullScreen':
          this.isFullScreen = !this.isFullScreen;
          this.graphResize();
          break;
        case 'autoFormat':
          this.autoFormatGraph();
          break;
        case 'adjustCanvas':
          this.graph.fitView(20);
          break;
        case 'realRatio':
          this.graphZoom('to');
          break;
        case 'zoomIn':
          this.graphZoom('in');
          break;
        case 'zoomOut':
          this.graphZoom('out');
          break;
        default:
          break;
      }
      this.toolbalEvent = '';
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    dragoverHandler(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    dropHandler(e) {
      e.preventDefault();
      const pointPos = this.graph.getPointByCanvas(
        e.offsetX - e.dataTransfer.getData('offsetX') + 100,
        e.offsetY - e.dataTransfer.getData('offsetY') + 16,
      );
      const { x } = pointPos;
      const { y } = pointPos;
      const itemId = parseInt(e.dataTransfer.getData('itemId'), 10);
      for (const item of itemList) {
        for (const node of item.children) {
          if (node.itemId === itemId) {
            this.graph.addItem('node', {
              id: `node${Date.now()}${uniqueId()}`,
              x,
              y,
              label: node.label,
              inPoints: node.inPoints,
              outPoints: node.outPoints,
              anchorPoints: [...node.inPoints, ...node.outPoints],
              type: 'customNode',
            });
            return;
          }
        }
      }
    },

    contextmenuHandler(e, type) {
      if (type === 'edge') {
        this.currentEdge = e.item;
        this.contextType = 'edge';
      } else if (type === 'node') {
        this.currentNode = e.item;
        this.contextType = 'node';
      } else {
        return;
      }

      this.showContextmenu = true;
      const pos = this.graph.getCanvasByPoint(e.x, e.y);
      this.contextmenuPos.left = `${pos.x}px`;
      this.contextmenuPos.top = `${pos.y}px`;
    },
    preventContextmenu(e) {
      e.preventDefault();
      return false;
    },
    closeContextmenu() {
      this.showContextmenu = false;
    },

    autoFormatGraph() {
      this.graph.updateLayout({
        type: 'dagre',
        rankdir: 'TB',
        nodesep: 70,
        ranksep: 30,
      });
    },
    graphResize() {
      this.$nextTick(() => {
        const container = document.getElementById('g6-container');
        const height = container.offsetHeight;
        const width = container.offsetWidth;

        this.graph.changeSize(width, height);
      });
    },
    graphZoom(type) {
      const canvasX = this.graph.get('width') / 2;
      const canvasY = this.graph.get('height') / 2;
      const { x, y } = this.graph.getPointByCanvas(canvasX, canvasY);

      if (type === 'in') {
        this.graph.zoom(1.1, { x, y });
      } else if (type === 'out') {
        this.graph.zoom(0.9, { x, y });
      } else if (type === 'to') {
        this.graph.get('group').resetMatrix();
      }
    },

    initG6() {
      G6.registerNode('customNode', customNode);
      Object.keys(customEdge).forEach((key) => {
        G6.registerEdge(key, customEdge[key]);
      });
      Object.keys(behaviors).forEach((key) => {
        G6.registerBehavior(key, behaviors[key]);
      });

      const container = document.getElementById('g6-container');
      const height = container.offsetHeight;
      const width = container.offsetWidth;

      this.graph = new G6.Graph({
        container: 'g6-container',
        height,
        width,
        defaultNode: {
          type: 'customNode',
        },
        modes: {
          default: ['drag-node', 'hoverNode', 'selectNode', 'selectEdge', 'drag-canvas'],
          addEdge: ['addEdge'],
        },
      });
      this.graph.on('afterlayout', () => {
        const zoom = this.graph.getZoom();
        this.graph.get('group').resetMatrix();

        let sumX = 0;
        let sumY = 0;
        let total = 0;
        const centerX = this.graph.get('width') / 2;
        const centerY = this.graph.get('height') / 2;

        const nodes = this.graph.getNodes();
        nodes.forEach((node) => {
          const model = node.getModel();
          sumX += model.x;
          sumY += model.y;
          total += 1;
        });

        const dx = centerX - sumX / total;
        const dy = centerY - sumY / total;

        nodes.forEach((node) => {
          const model = node.getModel();
          node.update({
            x: model.x + dx,
            y: model.y + dy,
          });
        });
        this.graph.zoomTo(zoom, { x: centerX, y: centerY });
      });

      if (this.graphData) {
        this.graph.read(this.graphData);
      }
    },
    initEvent() {
      this.$bus = eventBus;
      this.$bus.$on('nodeContext', (e) => {
        this.contextmenuHandler(e, 'node');
      });
      this.$bus.$on('edgeContext', (e) => {
        this.contextmenuHandler(e, 'edge');
      });
    },
    init() {
      this.initG6();
      this.initEvent();
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  height: 100vh;
}
.visualized-container {
  position: relative;
  height: 100%;
  background-color: #fff;
  padding: 40px 0 0 220px;

  &.full-screen {
    padding-left: 0;
    padding-right: 0;
  }
}
.editor-container {
  position: relative;
  height: 100%;
}
</style>
