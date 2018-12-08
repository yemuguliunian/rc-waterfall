'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./Waterfall.less');

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _reactLazyLoad = require('react-lazy-load');

var _reactLazyLoad2 = _interopRequireDefault(_reactLazyLoad);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _max = require('lodash/max');

var _max2 = _interopRequireDefault(_max);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _CalculateType = require('./CalculateType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 瀑布流（宽相同，高度不同）
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 设计思想（PC，APP）
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * PC : 定宽不定列
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * APP : 定列不定宽
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * athor : ywx
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * createTime : 2018/12/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var DEFAULT_SRCOLL_OFFSET = 20;

var Waterfall = function (_React$Component) {
    _inherits(Waterfall, _React$Component);

    function Waterfall(props) {
        _classCallCheck(this, Waterfall);

        var _this = _possibleConstructorReturn(this, (Waterfall.__proto__ || Object.getPrototypeOf(Waterfall)).call(this, props));

        _this.setCol = function () {
            var _t = _this;
            var containerW = _this.getRef('container').offsetWidth;
            var _this$props = _this.props,
                width = _this$props.width,
                gutter = _this$props.gutter,
                calculateType = _this$props.calculateType;
            // PC

            if (calculateType === _CalculateType.PC) {
                if (!'width' in _t.props) {
                    throw new Error('When Type of calculate is ' + _CalculateType.PC + '\uFF0Cthe props of [with] is required');
                }
                var actualCol = parseInt(containerW / (width + gutter));
                _this.setState({
                    col: actualCol,
                    containerInnerWidth: actualCol * width + (actualCol - 1) * gutter
                }, function () {
                    _t.initColHeight();
                    _t.calculateLayout();
                });
            }
            // APP
            if (calculateType === _CalculateType.APP) {
                if (!'defaultCol' in _t.props) {
                    throw new Error('When Type of calculate is ' + _CalculateType.APP + '\uFF0Cthe props of [defaultCol] is required');
                }
                var defaultCol = _this.props.defaultCol;

                var colWidth = (containerW - (defaultCol - 1) * gutter) / defaultCol;
                _this.setState({
                    col: defaultCol,
                    width: colWidth,
                    containerInnerWidth: containerW
                }, function () {
                    _t.initColHeight();
                    _t.calculateLayout();
                });
            }
        };

        _this.calculateLayout = function () {
            var _t = _this;
            var gutter = _t.props.gutter;
            var width = _t.state.width;

            _this.refsArray.map(function (ref, index) {
                // 这边延时处理是为了防止获取不到clientHeight
                if (!ref.clientHeight) {
                    _this.winDelayTimer = setTimeout(function () {
                        _t.calculate(ref, index);
                    }, 300);
                } else {
                    _t.calculate(ref, index);
                }
            });
        };

        _this.calculate = function (ref, index) {
            var _t = _this;
            var gutter = _t.props.gutter;
            var width = _t.state.width;

            var childHeight = ref.clientHeight;
            var minIndex = 0,
                minColHeight = _t.colHeight[0];
            _t.colHeight.map(function (item, i) {
                if (item < minColHeight) {
                    minColHeight = item;
                    minIndex = i;
                }
            });
            ref.style.left = minIndex * width + (minIndex == 0 ? 0 : gutter * minIndex) + 'px';
            ref.style.top = minColHeight + 'px';
            // 上次保存的高度 + child高度 + 间隔
            _t.colHeight[minIndex] = minColHeight + childHeight + gutter;
            if (index === _t.refsArray.length - 1) {
                _t.setState({
                    containerInnerHeight: (0, _max2.default)(_t.colHeight)
                });
            }
        };

        _this.initColHeight = function () {
            var col = _this.state.col;

            _this.colHeight = [];
            for (var i = 0; i < col; i++) {
                _this.colHeight[i] = 0;
            }
        };

        _this.renderChildren = function () {
            var _t = _this;
            var children = _this.props.children;
            if (_react2.default.Children.count(children) === 0) {
                return children;
            }
            // 渲染子组件时，重置refsArray
            if (_t.refsArray.length > 0) {
                _t.refsArray = [];
            }
            return _react2.default.Children.map(children, function (child, i) {
                return _t.cloneElement(child);
            });
        };

        _this.cloneElement = function (child, i) {
            var _t = _this;
            var _t$props = _t.props,
                gutter = _t$props.gutter,
                lazy = _t$props.lazy;
            var width = _t.state.width;

            var children = _react2.default.cloneElement(child, {
                name: i,
                style: {
                    width: width,
                    left: 0,
                    position: 'absolute',
                    transition: 'top 1s ease, left 1s ease'
                },
                ref: function ref(_ref) {
                    if (!!_ref) {
                        _t.refsArray.push(_ref);
                    }
                }
            });

            // 懒加载预留
            if (lazy) {
                var lazyProps = _extends({}, lazy);
                children = _react2.default.createElement(
                    _reactLazyLoad2.default,
                    lazyProps,
                    children
                );
            }

            // 加载动画预留
            return children = _react2.default.createElement(
                _rcAnimate2.default,
                {
                    component: '',
                    showProp: 'visible',
                    transitionAppear: true,
                    transitionName: 'fade'
                },
                children
            );

            // 预览图片功能预留
        };

        _this.getRef = function (name) {
            return _this[name];
        };

        _this.saveRef = function (name) {
            return function (node) {
                if (node) {
                    _this[name] = node;
                }
            };
        };

        _this.handleScroll = function () {
            var _t = _this;
            var scrollOffset = _this.props.scrollOffset;

            scrollOffset = scrollOffset > DEFAULT_SRCOLL_OFFSET ? scrollOffset : DEFAULT_SRCOLL_OFFSET;
            // 当前滚动条到顶部的距离
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            // 浏览器的可视高度
            var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
            // 网页高度
            var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            if (height - clientHeight - scrollTop < scrollOffset && !_t.isLoading) {
                _t.isLoading = true;
                if ('onScroll' in _this.props) {
                    _t.props.onScroll();
                    _t.isLoading = false;
                }
            }
        };

        _this.state = {
            col: props.defaultCol,
            width: props.width,
            containerInnerWidth: 0,
            containerInnerHeight: 0
        };

        // 存储ref
        _this.refsArray = [];
        // 是否在加载数据
        _this.isLoading = false;
        return _this;
    }

    _createClass(Waterfall, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.setCol();
            this.debouncedResize = (0, _debounce2.default)(function () {
                _this2.setCol();
            }, 250);
            this.resizeEvent = window.addEventListener('resize', this.debouncedResize);
            this.scrollEvent = window.addEventListener('scroll', this.handleScroll);
        }

        // 设置列


        // 布局


        // 初始化每列的高度


        // 拷贝

    }, {
        key: 'render',
        value: function render() {
            var _t = this;
            var prefixCls = this.props.prefixCls;
            var _state = this.state,
                col = _state.col,
                containerInnerWidth = _state.containerInnerWidth,
                containerInnerHeight = _state.containerInnerHeight;


            var waterfallStyle = {};
            if (containerInnerWidth) {
                waterfallStyle = {
                    display: 'block',
                    width: containerInnerWidth,
                    height: containerInnerHeight
                };
            }

            return _react2.default.createElement(
                'div',
                {
                    className: prefixCls,
                    ref: this.saveRef('container')
                },
                _react2.default.createElement(
                    'div',
                    {
                        className: prefixCls + '-inner',
                        style: waterfallStyle
                    },
                    this.renderChildren()
                )
            );
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.resizeEvent = window.removeEventListener('resize', this.debouncedResize);
        }

        // 滚动加载

    }]);

    return Waterfall;
}(_react2.default.Component);

Waterfall.defaultProps = {
    prefixCls: 'rc-waterfall',
    defaultCol: 2, // 几列
    width: 200, // 列宽
    gutter: 16, // 间隔
    calculateType: _CalculateType.PC,
    lazy: false, // 懒加载
    scrollOffset: DEFAULT_SRCOLL_OFFSET
};


Waterfall.propTypes = {
    defaultCol: _propTypes2.default.number,
    width: _propTypes2.default.number,
    gutter: _propTypes2.default.number,
    calculateType: _propTypes2.default.oneOf([_CalculateType.PC, _CalculateType.APP]),
    scrollOffset: _propTypes2.default.number
};

exports.default = Waterfall;
module.exports = exports['default'];