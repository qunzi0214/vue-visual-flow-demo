import { each } from '@antv/util';
import eventBus from '../utils/eventBus';

export default {
  getEvents() {
    return {
      'node:click': 'onNodeClick',
      'canvas:click': 'onCanvasClick',
      'node:contextmenu': 'onContextmenu',
    };
  },
  onNodeClick(e) {
    const { item } = e;
    const { graph } = this;
    const selected = graph.findAllByState('node', 'selected');
    each(selected, (node) => {
      node.setState('selected', false);
    });
    item.setState('selected', true);

    // todo: test code need delete
    item.setState('running', true);
    item.getInEdges().forEach((edge) => {
      edge.setState('running', true);
    });
    // end of test code
  },
  onCanvasClick() {
    const { graph } = this;
    const selected = graph.findAllByState('node', 'selected');
    each(selected, (node) => {
      node.setState('selected', false);
    });
  },
  onContextmenu(e) {
    eventBus.$emit('nodeContext', e);
  },
};
