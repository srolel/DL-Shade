angular.module('ShadeServices', [])

    .service('ShadeHandlers', function (ShadeElements, ShadeStyles) {

        this.openElement = ShadeElements.openElement;
        this.closeElement = ShadeElements.closeElement;
        this.getCurrent = ShadeElements.getCurrent;
        this.addStyles = ShadeStyles.addStyles;
        this.handleStyles = ShadeStyles.handleStyles;

        var that = this,
            handleSub = function (node) {
                _.each(((angular.isArray(node.Sub) ? node.Sub : {Node: node.Sub}) || {Node: {}}).Node, that.handleNodes);
            }

        //control-block handlers
        this.CbHandlers = {
            SETDLVARIABLE: function (cb) {
                return cb.Event + ',setDL,' + cb.Stat;
            },
            SHOWPOPUP: function (cb) {
                return cb.Event + ',popup,' + cb.Stat;

            },
            MESSAGE: function () {}

        };
        //TODO: change arguments to handlers below from array to an object
        this.UIHandlers = {

            //openElement = function (elmName, className, node, customStyles, customAttr, content, close) {

            Button: function (node, cb) {
                that.openElement('shd-button', 'btn btn-default', node, '', cb, '');
                that.closeElement();
            },

            CheckBox: function (node) {
                var attrs = node.Value ? '' : 'type="checkbox" label="' + node.Text + '"';
                that.openElement('div', 'inputs', node, '', attrs);
                that.closeElement();
            },

            DatePicker: function (node) {
                that.openElement('shd-date-picker', '', node, '');
                that.closeElement();

            },

            DropDown: require('./DropDown'),

            Grid: require('./Grid'),

            Image: function (node) {
                that.openElement('shd-image', '', node, '', '', '');
                that.closeElement();
            },

            Item: function (node) {
                that.openElement('li');
                that.openElement('a', '', {}, '', 'href="#"',node.Text)
                if (node.Sub) {
                    that.openElement('ul');
                    handleSub(node);
                    that.closeElement();
                }
                that.closeElement();
                that.closeElement();
            },

            Label: function (node) {
                that.openElement('div', '', node);
                that.closeElement();
            },

            ListBox: function (node) {
                that.openElement('list-box', '', node);
                handleSub(node);
                that.closeElement();
            },

            ListItem : function (node) {
                that.openElement('option', '', node);
                that.closeElement();
            },

            Menu : function (node) {
                that.openElement('ul', 'menu');
                handleSub(node);
                that.closeElement();
            },

            MultiSelComboBox: _.partialRight(require('./DropDown'), true),

            NumEdit: function (node) {
                that.openElement('div', 'inputs', node, '', 'type="text"');
                that.closeElement();
            },

            NumericUpDown: function (node) {
                that.openElement('num-up-down', '', node);
                that.closeElement();
            },

            Popup: function (node) {
                that.openElement('popup', '', node, 'display:none;');
                handleSub(node);
                that.closeElement();
            },

            RadioButton: function (node) {
                var attrs = node.Value ? '' : 'type="radio" value="' + node.Text +'" label="' + node.Text + '"';
                that.openElement('div', 'inputs', node, '', attrs);
                that.closeElement();
            },

            TabSet: function (node) {
                that.openElement('tabset', '', node);
                handleSub(node);
                that.closeElement();
            },

            Tab: function (node) {
                that.openElement('tab', '', node, '', 'heading="' + node.Text + '"', '');
                handleSub(node);
                that.closeElement();
            },

            TestDL: function (node) {
                that.openElement('test-dl', '', node);
                that.closeElement();
            },

            TextBox: function (node) {
                var attrs = 'type="text" placeholder="' + node.Text + '"'
                that.openElement('div', 'inputs', node, '', attrs, '');
                that.closeElement();
            },

            TimePicker: function (node) {
                that.openElement('time-picker', '', node, 'display:inline-block;');
                that.closeElement();
            },

            Unknown: function (node) {
                console.log("can't find control - " + node.UI)
            }

        };

        this.nodeHandlers = {
            Styles: that.addStyles,

            Node: function (node) {

                var handleCb = function (result, Cb) {
                    return result += (result ? ';' : '') + that.CbHandlers[Cb.Fn](Cb);
                }

                var controlBlock = node.Cb ? 'control-block="' + _.reduce(node.Cb.length ? node.Cb : [node.Cb], handleCb, '') + '" ' : '';
                (that.UIHandlers[node.UI] || that.UIHandlers.Unknown).call(that, node, controlBlock);
            },
            Unknown: function (node, index) {
                console.log("can't recognize tag <" + index + ">.");
            }
        };


        this.handleNodes = function (node, index) {
            if (angular.isArray(node)) {
                _.each(node, that.handleNodes.bind({index: index}));
            } else {
                var handlers = that.nodeHandlers;
                (handlers[index] || handlers[this.index] || handlers.Unknown)(node, index);
            }
        };

        return this;

    })

    .service('ShadeParser', function (ShadeHandlers, ShadeStyles, ShadeElements) {

        this.parse = function (shd) {
            if (shd) {
                ShadeStyles.init();
                ShadeElements.init();

                _.each(shd.Shade, ShadeHandlers.handleNodes);
                return {
                    shade: shd.Shade,
                    styles: ShadeStyles.getStyles(),
                    elements: ShadeElements.getElements(),
                    elementsById: ShadeElements.getElementsById()
                };
            }
        }
        return this;
    })

    //translations from shade attributes and styles to HTML
    .service('ShadeStaticHandlers', function() {

        this.attrNameHandlers = {
            vDL: '',
            vText: '',
            Name: 'id',
            vActiveTabIndex: '',
            CSpan: 'colspan',
            DefaultValue: 'dvalue',
            Maximum: 'max',
            Minimum: 'min',
            FormatString: 'format',
            Source: 'src',
            Text: 'text',
            vSub: ''
        };

        this.attrValueHandlers = {

        };

        this.styleNameHandlers = {
            Width: '',
            Height: '',
            Fg: 'color',
            Bg: 'background-color'

        };

        this.styleValueHandlers = {
            Width: function (width) { return width + "px"; },
            Height: function (height) { return height + "px"; }
        };

        return this;

    })

    //responsible for creating a global string of styles for elements to be appended to a <style> tag
    .service('ShadeStyles', function (ShadeStaticHandlers) {

        var styleNames = ShadeStaticHandlers.styleNameHandlers,
            styleValues = ShadeStaticHandlers.styleValueHandlers,
            gstyles = "";

        var translateStyle = function(style, value) {
            var styleTranslation, type, ret = '';
            if (value && styleNames.hasOwnProperty(style)) {

                ret += (styleNames[style] || style) + ': ';

                type = typeof (styleTranslation = (styleValues[value] || styleValues[style]));

                var typeHandlers = {
                    undefined: function(value) { return value.toLowerCase()},
                    function: function(value) { return styleTranslation(value)},
                    other: function() {return styleTranslation;}
                }

                ret += (typeHandlers[type] || typeHandlers.other)(value) + " !important;";

            }
            return ret;
        }

        this.addStyles = function (className, styles) {
            if (_.isString(className) && _.isString(styles)) {
                gstyles += "." + className + " { " + styles + "}\n";
            } else { //in case there's only 1 argument, it's a string of styles.
                var parsedStyles = className.replace(/\s/g, '').replace(/(\w+):(\w+)/g, function (match, p1, p2) {
                    return translateStyle(p1, p2);
                });
                gstyles += parsedStyles + "\n";
            }
        };


        this.handleStyles = function (styles, value, style) {
            return styles + translateStyle(style, value)
        };

        this.getStyles = function () {
            return gstyles;
        };

        this.init = function () {
            gstyles = "";
        };

        return this;

    })

    //creates an object describing an HTML page's element hierarchy.
    // This is later fed to the template that generates the HTML
    .service('ShadeElements', function (ShadeStyles) {


        var classCount = 0,
            elmId = 0,
            elements = [],
            elementsById = [],
            currentElement = {nodes: elements};

        //wrappers for creating HTML elements. Creates enumerated CSS classes for each element with style(s).
        this.openElement = function (elmName, className, node, customStyles, customAttr, content, close) {

            if (!_.isEmpty(node)) {
                node.id = elmId;
                elementsById[elmId++] = node;
            }

            var nativeStyles = _.reduce(node, ShadeStyles.handleStyles, ''),
                nativeClass = ((nativeStyles || customStyles) ? "class" + ++classCount : ''),
                node = node || {};
            cur = currentElement.nodes.push({
                elmName: elmName,
                nativeClass: nativeClass + (node.Style ? (' ' + node.Style) : ''),
                'className' : className,
                node: node,
                customStyles: customStyles,
                customAttr: customAttr,
                content: angular.isDefined(content) ? content : node.Text,
                nodes: [],
                parent: currentElement,
                id: node.id,
                close: _.isUndefined(close)

            });
            if (customStyles || nativeStyles) {
                ShadeStyles.addStyles(nativeClass, (customStyles || '') + (nativeStyles || ''));
            }
            currentElement = currentElement.nodes[cur - 1];



        };

        this.closeElement = function () {
            currentElement = currentElement.parent;
        };

        this.getCurrent = function () {
            return currentElement;
        }

        this.getElements = function () {
            return elements;
        };

        this.getElementsById = function () {
            return elementsById;
        };

        this.init = function () {
            classCount = 0;
            elmId = 0;
            elements = [];
            currentElement = {nodes: elements};
            elementsById = [];
        };

        return this;

    })
