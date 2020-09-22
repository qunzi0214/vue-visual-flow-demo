<template>
  <div id="app">
    <visual-flow
      :tree-list="treeList"
      :tool-list="toolList"
      :contextmenu-list="contextmenuList"

      :graph.sync="graph"
      :current-node.sync="currentNode"
      :current-edge.sync="currentEdge"

      @contextmenuEvent="contextmenuEvent"
    />
  </div>
</template>

<script>
import treeListMock from './treeListMock';

export default {
  name: 'app',
  data() {
    return {
      treeList: treeListMock,
      toolList: ['zoomIn', 'zoomOut', 'adjustCanvas', 'realRatio', 'autoFormat', 'fullScreen'],
      contextmenuList: {
        node: [
          {
            label: '删除节点',
            eventName: 'removeNode',
          },
        ],
        edge: [
          {
            label: '删除边',
            eventName: 'removeEdge',
          },
        ],
        canvas: [
          {
            label: '不知道做点啥',
            eventName: 'unknow',
          },
        ],
      },

      graph: {},
      currentNode: {},
      currentEdge: {},
    };
  },
  methods: {
    contextmenuEvent(eventName) {
      if (eventName === 'removeNode') {
        this.graph.removeItem(this.currentNode);
      }

      if (eventName === 'removeEdge') {
        this.graph.removeItem(this.currentEdge);
      }

      if (eventName === 'unknow') {
        alert('真的啥都没做呢');
      }
    },

    getGraphData() {
      console.log(JSON.stringify(this.graph.save()));
    },
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
<style lang="scss">
#app {
  height: 100vh;
  box-sizing: border-box;
  padding: 50px;
  background-color: #F6F7FB;
}
</style>
