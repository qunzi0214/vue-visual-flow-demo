## 项目环境

- antv/g6： 3.6.0
- vue：2.6.10

> elementui 只用到了很小一部分组件，可以取代

## 项目说明

因为业务需要做一个可视化流程编辑器，鉴于antv项目中的 ``g6-editor`` 停止维护并不对外开放商用了，官方的建议是可以基于 ``antv/g6`` 自己实现。大佬 [caoyu48/vue-g6-editor](https://github.com/caoyu48/vue-g6-editor) 实现了一个更加完整，功能更多的demo。但是由于 ``antv/g6`` 的升级，一些api的变动以及坐标系的改变，不得不硬着头皮自己撸了一个。倾向使用官方api更加简洁的完成所需功能。

> 一段关于状态设置的测试代码，点击节点后节点和入边有运行中状态效果 ``src/g6Editor/behavior/selectNode.js:21``

## 如果有时间的todo-list

- 基于官方api的 undo redo 功能
- 多选节点拖拽功能

