import throttle from 'lodash/throttle';
import uniqueId from 'lodash/uniqueId';

export default {
  edge: null,
  startItem: null,
  startPoint: null,
  sourceAnchorIndex: -1,
  targetAnchorIndex: -1,
  getEvents() {
    return {
      mousemove: 'onMousemove',
      mouseup: 'onMouseup',
      'node:mouseover': 'onMouseover',
      'node:mouseleave': 'onMouseleave',
    };
  },
  onMouseup(e) {
    if (e.item && e.item.getType() === 'node') {
      const group = e.item.getContainer();

      if (e.target.attrs.isInPoint) {
        this.targetAnchorIndex = e.target.attrs.anchorIndex;
      } else if (e.target.attrs.isInPointOut) {
        this.targetAnchorIndex = group.find((child) => child.attrs.id === e.target.attrs.parent)
          .attrs.anchorIndex;
      }

      if (this.targetAnchorIndex >= 0) {
        this.graph.addItem('edge', {
          id: `edge${Date.now()}${uniqueId()}`,
          source: this.startItem.getModel().id,
          target: e.item.getModel().id,
          sourceAnchor: this.sourceAnchorIndex,
          targetAnchor: this.targetAnchorIndex,
          type: 'customEdge',
        });
      }
    }

    if (this.edge) {
      this.graph.removeItem(this.edge);
      this.startPoint = null;
      this.edge = null;
      this.startItem = null;
      this.sourceAnchorIndex = -1;
      this.targetAnchorIndex = -1;
    }
    this.graph.find('node', (node) => {
      node.setState('hover', false);
      const group = node.get('group');
      group.cfg.children
        .forEach((child) => {
          if (child.attrs.isInPointOut) {
            child.attr('opacity', '0');
            child.attr('r', 10);
          }
          if (child.attrs.isOutPoint) {
            child.attr('fill', '#fff');
          }
          if (node.hasState('selected') || node.hasState('hover')) {
            return;
          }
          if (child.attrs.isInPoint || child.attrs.isOutPoint) {
            child.attr('opacity', '0');
          }
        });
    });
    this.graph.setMode('default');
  },
  onMouseover(e) {
    if (e.target.attrs.isInPointOut && !this.hasTransformed) {
      e.target.attr('r', 12);
      this.hasTransformed = true;
    }
  },
  onMouseleave(e) {
    const group = e.item.get('group');
    group.cfg.children
      .forEach((child) => {
        if (child.attrs.isInPointOut) {
          child.attr('r', 10);
        }
      });
    this.hasTransformed = false;
  },
  // eslint-disable-next-line
  onMousemove: throttle(function (e) {
    const { item } = e;

    if (!this.startPoint) {
      this.startItem = item;
      this.graph.find('node', (node) => {
        const group = node.get('group');
        group.cfg.children
          .forEach((child) => {
            if (child.attrs.isInPointOut) {
              child.attr('opacity', '0.3');
            }
            if (child.attrs.isInPoint) {
              child.attr('opacity', '1');
            }
          });
      });
      this.sourceAnchorIndex = e.target.attrs.anchorIndex;
      const x = e.target.attrs.x + item.getModel().x;
      const y = e.target.attrs.y + item.getModel().y;
      this.startPoint = { x, y };
      this.edge = this.graph.addItem('edge', {
        source: item,
        target: item,
        start: this.startPoint,
        end: this.startPoint,
        type: 'moveEdge',
      });
    } else if (this.edge) {
      this.graph.updateItem(this.edge, {
        end: { x: e.x, y: e.y },
      });
    }
  }),
};
