# H5下拉组件

## Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---|---|---|---|---|
| disabled | 是否禁用下拉 | boolean | - | false |
| showResultText | 是否显示下拉结果提示文字 | boolean | - | true |
| transition | 回弹过渡时间 | number | - | 300 |
| resultShowTime | 下拉结果展示时间 | number | - | 300 |
| pullingText | 下拉提示文字 | string | - | 下拉刷新 |
| loadingText | 加载提示文字 | string | - | 数据加载中 |
| loosingText | 取消提示文字 | string | - | 松开即可加载 |
| successText | 加载成功提示文字 | string | - | 加载成功 |
| failText | 加载失败提示文字 | string | - | 加载失败 |
| refreshHeadClass | 下拉提示文字class | string | - | - |
| refreshHeadStyle | 下拉提示文字style | object | - | - |
| startTouch | 开始下拉回调 | Function | - | - |
| duringTouch | 下拉中回调 | Function | - | - |
| refreshTouch | 加载数据回调 | Function | - | - |
| cancelTouch | 取消下拉回调 | Function | - | - |

## Slot
| name | 说明 |
|---|---|
| - | 内容主体 |
| head | 下拉文字提示（如果使用该slot，下拉文字提示将失效） |

## 其他
- 下拉程度超过70%即可触发