import uniqueId from 'lodash/uniqueId';
import runningSvg from '@/assets/running.svg';
import finishSvg from '@/assets/finish.svg';
import { Util } from '@antv/g6';
import {
  themeColor, borderColor, textColor, selectBorderColor, bgColor, selectBgColor,
} from '../constantConfig/colorSet';

export default {
  draw(cfg, group) {
    const width = 200;
    const height = 32;
    const color = cfg.color || themeColor;

    const offsetX = -width / 2;
    const offsetY = -height / 2;
    const mainId = `rect${Date.now()}${uniqueId()}`;
    let anchorIndex = 0;

    const keyShape = group.addShape('rect', {
      name: 'base-shape',
      draggable: true,
      attrs: {
        id: mainId,
        x: offsetX,
        y: offsetY,
        width,
        height,
        stroke: borderColor,
        fill: bgColor,
        radius: 4,
        cursor: 'move',
      },
    });

    group.addShape('rect', {
      name: 'pre-rect',
      draggable: true,
      attrs: {
        x: offsetX,
        y: offsetY,
        width: 3,
        height,
        fill: color,
        parent: mainId,
        radius: [4, 0, 0, 4],
        cursor: 'move',
      },
    });

    if (cfg.label) {
      group.addShape('text', {
        name: 'text-shape',
        draggable: true,
        attrs: {
          x: 0,
          y: 0,
          textAlign: 'center',
          textBaseline: 'middle',
          text: cfg.label,
          parent: mainId,
          fill: textColor,
          cursor: 'move',
        },
      });
    }

    if (cfg.inPoints) {
      for (let i = 0; i < cfg.inPoints.length; i += 1) {
        const x = width * cfg.inPoints[i][0];
        const y = cfg.inPoints[i][1] === 0 ? 0 : height;
        const id = `circle${Date.now()}${uniqueId()}`;
        group.addShape('circle', {
          attrs: {
            id: `circle${Date.now()}${uniqueId()}`,
            parent: id,
            anchorIndex,
            x: x + offsetX,
            y: y + offsetY,
            r: 10,
            isInPointOut: true,
            fill: themeColor,
            opacity: 0,
          },
        });
        group.addShape('circle', {
          attrs: {
            id,
            parent: mainId,
            anchorIndex,
            x: x + offsetX,
            y: y + offsetY,
            r: 3,
            isInPoint: true,
            fill: bgColor,
            stroke: themeColor,
            opacity: 0,
          },
        });
        anchorIndex += 1;
      }
    }

    if (cfg.outPoints) {
      for (let i = 0; i < cfg.outPoints.length; i += 1) {
        const x = width * cfg.outPoints[i][0];
        const y = cfg.outPoints[i][1] === 0 ? 0 : height;
        const id = `circle${Date.now()}${uniqueId()}`;
        group.addShape('circle', {
          attrs: {
            id: `circle${Date.now()}${uniqueId()}`,
            parent: id,
            anchorIndex,
            x: x + offsetX,
            y: y + offsetY,
            r: 10,
            isOutPointOut: true,
            fill: themeColor,
            opacity: 0,
            cursor: 'crosshair',
          },
        });
        group.addShape('circle', {
          attrs: {
            id,
            parent: mainId,
            anchorIndex,
            x: x + offsetX,
            y: y + offsetY,
            r: 3,
            isOutPoint: true,
            fill: bgColor,
            stroke: themeColor,
            opacity: 0,
            cursor: 'crosshair',
          },
        });
        anchorIndex += 1;
      }
    }

    const centerPoint = { x: -10, y: -10 };
    const running = group.addShape('image', {
      name: 'running-image',
      attrs: {
        x: centerPoint.x + 80,
        y: centerPoint.y,
        width: 20,
        height: 20,
        img: runningSvg,
        parent: mainId,
        opacity: 0,
        isRunning: true,
      },
    });
    running.animate(
      (ratio) => {
        const matrix = Util.mat3.create();
        const toMatrix = Util.transform(matrix, [
          ['t', -80, 0],
          ['r', ratio * Math.PI * 2],
          ['t', 80, 0],
        ]);
        return {
          matrix: toMatrix,
        };
      },
      {
        repeat: true,
        duration: 2000,
        easing: 'easeLinear',
      },
    );

    group.addShape('image', {
      name: 'finish-image',
      attrs: {
        x: centerPoint.x + 80,
        y: centerPoint.y,
        width: 20,
        height: 20,
        img: finishSvg,
        parent: mainId,
        opacity: 0,
        isFinish: true,
      },
    });

    return keyShape;
  },
  setState(name, value, item) {
    const group = item.getContainer();

    if (item.hasState('selected') && name === 'hover') {
      return;
    }
    if (name === 'selected' || name === 'hover') {
      const shape = group.get('children')[0];
      const points = group.findAll((point) => point.attrs.isInPoint || point.attrs.isOutPoint);
      if (value) {
        shape.attr('fill', selectBgColor);
        shape.attr('stroke', selectBorderColor);
        points.forEach((point) => {
          point.attr('opacity', 1);
        });
      } else {
        shape.attr('fill', bgColor);
        shape.attr('stroke', borderColor);
        points.forEach((point) => {
          point.attr('opacity', 0);
        });
      }
    }

    if (name === 'running') {
      const running = group.find((shape) => shape.attrs.isRunning);
      if (value) {
        running.attr('opacity', 1);
      } else {
        running.attr('opactiy', 0);
      }
    }

    if (name === 'finish') {
      const finish = group.find((shape) => shape.attrs.isFinish);
      if (value) {
        finish.attr('opacity', 1);
      } else {
        finish.attr('opactiy', 0);
      }
    }
  },
};
