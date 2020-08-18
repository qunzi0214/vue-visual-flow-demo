<template>
  <div class="item-panel-container">
    <ul>
      <li v-for="(item, index) in itemList" :key="index">
        <p :class="{'title': true, 'on': item.showFlag}" @click="item.showFlag = !item.showFlag">
          {{ item.title }}
        </p>
        <el-collapse-transition>
          <div v-show="item.showFlag" class="collapse-box">
            <p
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              class="item-button"
              draggable="true"
              @dragstart="dragstartHandler($event, child.itemId)"
            >
              {{ child.label }}
            </p>
          </div>
        </el-collapse-transition>
      </li>
    </ul>
  </div>
</template>

<script>
import itemList from '../constantConfig/itemList';

export default {
  name: 'ItemPanel',
  data() {
    return {
      showBox1: false,
      itemList,
    };
  },
  methods: {
    dragstartHandler(e, itemId) {
      e.dataTransfer.setData('offsetX', e.offsetX);
      e.dataTransfer.setData('offsetY', e.offsetY);
      e.dataTransfer.setData('itemId', itemId);
    },
  },
};
</script>

<style lang="scss" scoped>
.item-panel-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 220px;
  height: 100%;
  background-color: #F5F5F5;
  user-select:none;
  z-index: 2;
}
.title {
  position: relative;
  height: 36px;
  font-size: 12px;
  line-height: 36px;
  color: #4A5366;
  padding-left: 35px;
  font-weight: bold;
  cursor: pointer;

  &:after{
    position: absolute;
    content: ' ';
    left: 21px;
    top: 50%;
    margin-top: -4px;
    border: 4px solid transparent;
    border-left-color: #bbb;
    transition: .2s all linear;
  }
  &.on:after {
    transform: rotate(90deg);;
  }
}
.item-button {
  width: 200px;
  height: 32px;
  box-sizing: border-box;
  background: #FFFFFF;
  border: 1px solid #E4E5EA;
  border-left: 3px solid #6ab7ff;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,0.05);
  border-radius: 4px;
  margin: 0 auto 8px;
  font-size: 12px;
  line-height: 32px;
  text-align: center;
  color: #4A5366;
  cursor: pointer;
}
.item-button:nth-last-child(1) {
  margin-bottom: 0;
}
</style>
