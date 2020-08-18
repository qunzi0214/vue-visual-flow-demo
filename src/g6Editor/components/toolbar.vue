<template>
  <div class="toolbar-root">
    <ul>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          content="运行"
          placement="bottom"
        >
          <div class="btn-box">
            <i class="el-icon-video-play" />
          </div>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          content="部署"
          placement="bottom"
        >
          <div class="btn-box">
            <i class="el-icon-upload" />
          </div>
        </el-tooltip>
      </li>
    </ul>
    <ul>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          content="放大"
          placement="bottom"
        >
          <div class="btn-box">
            <i class="el-icon-zoom-in" @click="updateEvent('zoomIn')" />
          </div>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          content="缩小"
          placement="bottom"
        >
          <div class="btn-box" @click="updateEvent('zoomOut')">
            <i class="el-icon-zoom-out" />
          </div>
        </el-tooltip>
      </li>

      <li>
        <el-tooltip
          class="item"
          effect="dark"
          content="适应画布"
          placement="bottom"
        >
          <div class="btn-box" @click="updateEvent('adjustCanvas')">
            <i class="el-icon-rank" />
          </div>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          content="实际尺寸"
          placement="bottom"
        >
          <div class="btn-box" @click="updateEvent('realRatio')">
            <i class="el-icon-c-scale-to-original" />
          </div>
        </el-tooltip>
      </li>

      <li>
        <el-tooltip
          class="item"
          effect="dark"
          content="自动排列"
          placement="bottom"
        >
          <div class="btn-box" @click="updateEvent('autoFormat')">
            <i class="el-icon-share" />
          </div>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip
          class="item"
          effect="dark"
          :content="isFullSreen? '恢复' : '全屏'"
          placement="bottom"
        >
          <div class="btn-box" @click="updateEvent('fullScreen')">
            <i class="el-icon-full-screen" />
          </div>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    toolbalEvent: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFullSreen: false,
    };
  },
  methods: {
    updateEvent(type) {
      this.$emit('update:toolbalEvent', type);
      if (type === 'fullScreen') {
        this.isFullSreen = !this.isFullSreen;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar-root {
  position: absolute;
  display: flex;
  top: -40px;
  left: 0;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  justify-content: space-between;
  align-items: center;

  ul {
    display: flex;

    .btn-box {
      padding: 5px;
      cursor: pointer;
      transition: .2s all linear;

      &:hover {
        box-shadow: 0 0 3px #bbb;

        i {
          color: #6ab7ff;
        }
      }
    }
  }
}
</style>
