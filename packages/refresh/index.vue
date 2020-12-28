<template lang='pug'>
  .mod-pull-refresh
    .pull-refresh-container
      .refresh-head-container(ref="HeadContainer")
        slot(name="head")
          .refresh-head(:style="refreshHeadStyle" :class="refreshHeadClass")
            | {{ headText }}
      .refresh-body-container(
        :style="bodyStyle"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
        @touchcancel="touchend"
      )
        slot
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { pending, throttle } from './utils'
import { PullStatusType } from './constant'

// eslint-disable-next-line
const foo = () => {}

@Component({
})
export default class Index extends Vue {
  @Prop({ default: false }) disabled: boolean // 是否禁用下拉
  @Prop({ default: true }) showResultText: boolean // 是否显示下拉结果提示文字
  @Prop({ default: 300 }) transition: number // 回弹过渡时间
  @Prop({ default: 300 }) resultShowTime: number // 下拉结果展示时间
  @Prop({ default: '下拉刷新' }) pullingText: string // 下拉提示文字
  @Prop({ default: '数据加载中' }) loadingText: string // 加载提示文字
  @Prop({ default: '松开即可加载' }) loosingText: string // 取消提示文字
  @Prop({ default: '加载成功' }) successText: string // 加载成功提示文字
  @Prop({ default: '加载失败' }) failText: string // 加载失败提示文字
  @Prop({ default: '' }) refreshHeadClass: string // 下拉提示文字class
  @Prop({ default () { return {} } }) refreshHeadStyle: { [key: string]: string } // 下拉提示文字style

  @Prop({ default () { return foo } }) startTouch: Function // 开始下拉回调
  @Prop({ default () { return foo } }) duringTouch: Function // 下拉中回调
  @Prop({ default () { return foo } }) refreshTouch: Function // 加载数据回调
  @Prop({ default () { return foo } }) cancelTouch: Function // 取消下拉回调

  maxPosition = 0 // 下拉最大距离
  loosePosition = 0 // 取消松回位置
  curPosition = 0 // 下拉主体当前位置
  startPosition = 0 // 手指开始位置
  pullStatus = PullStatusType.NOT_PULL // 下拉状态
  touchmove: Function = foo // 下拉函数

  // 下拉主体css
  get bodyStyle () {
    const style: { [key: string]: string } = {
      transform: `translateY(${this.curPosition}px)`
    }
    if (this.curPosition === 0) {
      style.transition = `all ${this.transition / 1000}s`
    }
    return style
  }

  // 是否可以下拉
  get canTouchMove () {
    return !this.disabled &&
      (
        this.pullStatus === PullStatusType.IS_PULL ||
        this.pullStatus === PullStatusType.CAN_REFRESH
      )
  }

  // 提示信息部分高度
  get headerElHeight () {
    return (this.$refs.HeadContainer as HTMLElement).offsetHeight
  }

  // 下拉提示信息
  get headText () {
    switch (this.pullStatus) {
      case PullStatusType.NOT_PULL:
        return ''
      case PullStatusType.IS_PULL:
        return this.pullingText
      case PullStatusType.CAN_REFRESH:
        return this.loosingText
      case PullStatusType.IS_REFRESH:
        return this.loadingText
      case PullStatusType.SUCCESS_REFRESH:
        return this.successText
      case PullStatusType.FAIL_REFRESH:
        return this.failText
      default:
        return ''
    }
  }

  // 初始化事件
  mounted () {
    this.touchmove = throttle(this.handleTouchmove, 20)
  }

  // 开始下拉
  touchstart (e: TouchEvent) {
    if (this.curPosition !== 0) {
      return
    }

    this.startPosition = e.touches[0].pageY
    this.pullStatus = PullStatusType.IS_PULL
    this.startTouch()
  }

  // 下拉中
  handleTouchmove (e: TouchEvent) {
    if (!this.canTouchMove) {
      return
    }

    const move = e.touches[0].pageY - this.startPosition
    if (move < 0) {
      this.curPosition = 0
      return
    }

    this.curPosition = Math.min(move, this.headerElHeight)
    this.maxPosition = Math.max(this.curPosition, this.maxPosition)

    if (this.curPosition > this.headerElHeight * 0.7) {
      this.pullStatus = PullStatusType.CAN_REFRESH
    } else {
      this.pullStatus = PullStatusType.IS_PULL
    }

    this.$nextTick(() => this.duringTouch({
      process: this.curPosition / this.headerElHeight,
      status: this.pullStatus
    }))
  }

  // 下拉结束
  async touchend () {
    if (this.pullStatus !== PullStatusType.CAN_REFRESH) {
      this.cancelTouch()
      this.resetPullStatus()
      return
    }

    this.pullStatus = PullStatusType.IS_REFRESH
    const refreshRes = await this.refreshTouch()
    if (this.showResultText) {
      this.pullStatus = refreshRes === false
        ? PullStatusType.FAIL_REFRESH
        : PullStatusType.SUCCESS_REFRESH
      await pending(this.resultShowTime)
    }

    this.resetPullStatus()
  }

  // 重置下拉状态
  resetPullStatus () {
    this.maxPosition = 0
    this.curPosition = 0
    this.pullStatus = PullStatusType.NOT_PULL
  }
}
</script>

<style lang='less' src="./index.less" scoped>
</style>
