# rc-waterfall
瀑布流

### 设计理念
PC : 定宽不定列

APP : 定列不定宽

功能：瀑布流（已实现），懒加载（已实现），设置动画（待），预览功能（待），滚动加载（已实现）

### API
| 参数        | 说明           | 类型  | 默认值 |
| ------------- |-------------| -----|-----|
| defaultCol     | 默认几列（calculateType为‘app’时生效） | number  | 2 |
| width     | 列宽（calculateType为‘pc’时生效） | number  | 200 |
| gutter     | 间隔 | number  | 16 |
| calculateType     | 展示方式('pc'\|'app') | string  | pc |
| lazy     | 懒加载 | boolean\|object  | false |
| onScroll     | 滚动加载 | function  |  |

