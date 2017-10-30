(function (window, go, $, _) {
    "use strict";

    /**
     * ServerMap
     *
     * @class ServerMap
     * @version 1.0.0
     * @since Sep, 2013
     * @author Denny Lim<hello@iamdenny.com, iamdenny@nhn.com>
     * @license MIT License
     * @copyright 2014 NAVER Corp.
     */
    window.ServerMap = $.Class({

        /**
         * constructor
         *
         * @constructor
         * @method ServerMap#$init
         * @param {object}
         */
        $init: function (htOption, $location, analyticsService) {
        	this.analyticsService = analyticsService;
        	this._query = "";
            this.option({
                "sContainerId": '',
                "sOverviewId": '',
                "sBigFont": "11pt avn85,NanumGothic,ng,dotum,AppleGothic,sans-serif",
                "sSmallFont": "10pt avn55,NanumGothic,ng,dotum,AppleGothic,sans-serif",
                "sImageDir": './images/',
                "sBoldKey": null,
                "htIcons": {
                    'APACHE': 'APACHE.png',
                    'APACHE_GROUP': 'APACHE.png',
                    'ARCUS': 'ARCUS.png',
                    'ARCUS_GROUP': 'ARCUS.png',
                    'BACKEND': 'BACKEND.png',
                    'BACKEND_GROUP': 'BACKEND.png',
                    'BLOC': 'BLOC.png',
                    'BLOC_GROUP': 'BLOC.png',
                    'CASSANDRA': 'CASSANDRA.png',
                    'CASSANDRA_GROUP': 'CASSANDRA.png',
                    'CUBRID': 'CUBRID.png',
                    'CUBRID_GROUP': 'CUBRID.png',
                    'JAVA': 'JAVA.png',
                    'JAVA_GROUP': 'JAVA.png',
                    'MEMCACHED': 'MEMCACHED.png',
                    'MEMCACHED_GROUP': 'MEMCACHED.png',
                    'MONGODB': 'MONGODB.png',
                    'MONGODB_GROUP': 'MONGODB.png',
                    'MSSQLSERVER': 'MSSQLSERVER.png',
                    'MSSQLSERVER_GROUP': 'MSSQLSERVER.png',
                    'MYSQL': 'MYSQL.png',
                    'MYSQL_GROUP': 'MYSQL.png',
                    'MARIADB': 'MARIADB.png',
                    'MARIADB_GROUP': 'MARIADB.png',
                    'POSTGRESQL': 'POSTGRESQL.png',
                    'POSTGRESQL_GROUP': 'POSTGRESQL.png',
                    'NBASE': 'NBASE.png',
                    'NBASE_GROUP': 'NBASE.png',
                    'NGINX': 'NGINX.png',
                    'NGINX_GROUP': 'NGINX.png',
                    'ORACLE': 'ORACLE.png',
                    'ORACLE_GROUP': 'ORACLE.png',
                    'QUEUE': 'QUEUE.png',
                    'QUEUE_GROUP': 'QUEUE.png',
                    'STAND_ALONE': 'STAND_ALONE.png',
                    'STAND_ALONE_GROUP': 'STAND_ALONE.png',
                    'SPRING_BOOT': 'SPRING_BOOT.png',
                    'TOMCAT': 'TOMCAT.png',
                    'TOMCAT_GROUP': 'TOMCAT.png',
                    'DUBBO_CONSUMER': 'DUBBO.png',
                    'DUBBO_CONSUMER_GROUP': 'DUBBO.png',
                    'DUBBO_PROVIDER': 'DUBBO.png',
                    'DUBBO_PROVIDER_GROUP': 'DUBBO.png',
                    'JETTY': 'JETTY.png',
                    'JETTY_GROUP': 'JETTY.png',
                    'UNDEFINED': 'UNDEFINED.png',
                    'UNDEFINED_GROUP': 'UNDEFINED.png',
                    'UNKNOWN': 'UNKNOWN.png',
                    'UNKNOWN_GROUP': 'UNKNOWN_GROUP.png',
                    'REDIS': 'REDIS.png',
                    'REDIS_GROUP': 'REDIS.png',
                    'NBASE_ARC': 'NBASE_ARC.png',
                    'NBASE_ARC_GROUP': 'NBASE_ARC.png',
                    'NBASE_T': 'NBASE_T.png',
                    'NBASE_T_GROUP': 'NBASE_T.png',
                    'USER': 'USER.png',
                    'USER_GROUP': 'USER.png'
                },
                "htNodeTheme": {
                    "default": {
                        "backgroundColor": "#ffffff",
                        "borderColor": "#C5C5C5",
                        "borderWidth": 1,
                        "fontColor": "#000000"
                    },
                    "bold": {
                        "backgroundColor": "#f2f2f2",
                        "borderColor": "#666975",
                        "borderWidth": 2,
                        "fontColor": "#000000"
                    }
                },
                "htLinkType": {
                    "sRouting": "AvoidsNodes", // Normal, Orthogonal, AvoidNodes
                    "sCurve": "JumpGap" // Bezier, JumpOver, JumpGap
                },
                "htLinkTheme": {
                    "default": {
                        "backgroundColor": "#ffffff",
                        "borderColor": "#c5c5c5",
                        "fontFamily": "11pt avn55,NanumGothic,ng,dotum,AppleGothic,sans-serif",
                        "fontColor": "#000000",
                        "fontAlign": "center",
                        "margin": 1,
                        "strokeWidth": 1
                    },
                    "bad": {
                        "backgroundColor": "#ffc9c9",
                        "borderColor": "#7d7d7d",
                        "fontFamily": "11pt avn55,NanumGothic,ng,dotum,AppleGothic,sans-serif",
                        "fontColor": "#FF1300",
                        "fontAlign": "center",
                        "margin": 1,
                        "strokeWidth": 1
                    }
                },
                "htHighlightNode": {
                    //"borderColor": "#25AFF4",
                	"borderColor": "#53069B",
                    "backgroundColor": "#289E1D",
                    //"fontColor": "#5cb85c"
                    "fontColor": "#53069B"
                },
                "htHighlightLink": {
                	"fontFamily": "bold 12pt avn55,NanumGothic,ng,dotum,AppleGothic,sans-serif",
                    //"borderColor": "#25AFF4",
                	"borderColor": "#53069B",
                    "strokeWidth": 2
                },
                "htPadding": {
                    "top": 10,
                    "right": 10,
                    "bottom": 10,
                    "left": 10
                },
                "unknownGroupName" : "UNKNOWN_GROUP",
                "fOnNodeSubGroupClicked": function(eMouseEvent, nodeKey ) {
                },
                "fOnNodeClicked": function (eMouseEvent, htData) {
                },
                "fOnNodeDoubleClicked": function (eMouseEvent, node, htData) {
                },
                "fOnNodeContextClicked": function (eMouseEvent, htData) {
                },
                "fOnLinkClicked": function (eMouseEvent, htData) {
                },
                "fOnLinkContextClicked": function (eMouseEvent, htData) {
                },
                "fOnBackgroundClicked": function (eMouseEvent, htData) {
                },
                "fOnBackgroundDoubleClicked": function (eMouseEvent, htData) {
                },
                "fOnBackgroundContextClicked": function (eMouseEvent, htData) {
                }
            });

            this.option(htOption);
            this._initVariables();
            this._initNodeTemplates();
            this._initLinkTemplates();
            this._initDiagramEnvironment();
            this._initOverview( $location );
        },

        /**
         * initialize variables
         *
         * @method ServerMap#_initVariables
         */
        _initVariables: function () {
            this.$ = go.GraphObject.make;
            this.nodeClickEventOnce = false;
            this._oDiagram = this.$(
                go.Diagram,
                this.option('sContainerId'),
                {
                    initialContentAlignment: go.Spot.Center,
                    maxSelectionCount: 1,
                    allowDelete: false
                }
            );
            this._oDiagram.animationManager.isEnabled = false;
			this._oDiagram.scrollMode = go.Diagram.InfiniteScroll;
        },

        /**
         * initialize node templates
         *
         * @method ServerMap#_initNodeTemplates
         */
        _initNodeTemplates: function () {
            var self = this,
                sImageDir = this.option('sImageDir'),
                htIcons = this.option('htIcons');

            var infoTableTemplate = self.$(
                go.Panel,
                go.Panel.TableRow,
                {

                },
                self.$(
                    go.TextBlock,
                    {
                        margin: new go.Margin(0, 2),
                        column: 1,
                        stroke: "#848484",
                        font: self.option('sSmallFont')
                    },
                    new go.Binding('text', 'k')
                ),
                self.$(
                    go.TextBlock,
                    {
                        margin: new go.Margin(0, 2),
                        column: 2,
                        stroke: "#848484",
                        font: self.option('sSmallFont')
                    },
                    new go.Binding('text', 'v')
                )
            );
            var calcuResponseSummaryCircleSize = function( sum, value ) {
            	var size = 0;
            	if ( value === 0 ) return 0;
    			var percentage = ( 100 * value ) /sum;
    			if ( percentage < calcuResponseSummaryCircleSize.minPercentage ) {
    				size = parseInt((calcuResponseSummaryCircleSize.maxSize * calcuResponseSummaryCircleSize.minPercentage) / 100);
    			} else {
    				size = parseInt((calcuResponseSummaryCircleSize.maxSize * percentage) / 100); 
    			}
    			return size;
            };
            calcuResponseSummaryCircleSize.maxSize = 360;
            calcuResponseSummaryCircleSize.minPercentage = 5;

            var getNodeTemplate = function (sImageName) {
                return self.$(
                    go.Node,
                    new go.Binding("category", "serviceType"),
                    go.Panel.Auto,
                    {
                        selectionAdorned: false,
                        cursor: "pointer",
                        name: "NODE",
                        click: function (e, obj) {
                            self._onNodeClicked(e, obj);
                        },
                        doubleClick: function(e, obj) {
                        	self._onNodeDoubleClicked(e, obj);
                        },
                        contextClick: self._onNodeContextClicked.bind(self)
                    },
                    self.$(
                        go.Shape,
                        {
                            alignment: go.Spot.TopLeft,
                            alignmentFocus: go.Spot.TopLeft,
                            figure: "RoundedRectangle",
                            strokeWidth: 1,
//                            margin: new go.Margin(10, 10, 10, 10),
                            margin: 0,
                            isPanelMain: true,
//                            maxSize: new go.Size(150, NaN),
                            minSize: new go.Size(120, NaN),
                            name: "NODE_SHAPE",
                            portId: ""
                        },
                        new go.Binding("strokeWidth", "key", function (key) {
                            var type = 'default';
                            if (self.option('sBoldKey') && self.option('sBoldKey') === key) {
                                type = 'bold';
                            }
                            return self.option('htNodeTheme')[type].borderWidth;
                        }),
                        new go.Binding("stroke", "key", function (key) {
                            var type = 'default';
                            if (self.option('sBoldKey') && self.option('sBoldKey') === key) {
                                type = 'bold';
                            }
                            return self.option('htNodeTheme')[type].borderColor;
                        }),
                        new go.Binding("fill", "key", function (key) {
                            var type = 'default';
                            if (self.option('sBoldKey') && self.option('sBoldKey') === key) {
                                type = 'bold';
                            }
                            return self.option('htNodeTheme')[type].backgroundColor;
                        }),
                        new go.Binding("key", "key")
                    ),
                    self.$(
                    	go.Shape, {
                    		stroke: "red",
                    		strokeWidth: 4,
                    		opacity: 0.8,
                    		margin : new go.Margin( -28, 0, 0, 0 ),
                    		visible: true
                    	},
                    	new go.Binding("visible", "isWas"),
                    	new go.Binding("geometry", "histogram", function(histogram) {
                    		return go.Geometry.parse("M30 0 B270 360 30 30 30 30");
                    	})
                    ),
                    self.$(
                    	go.Shape, {
                    		stroke: "orange",
                    		strokeWidth: 4,
                    		margin : new go.Margin( -28, 0, 0, 0 ),
                    		visible: true
                    	},
                    	new go.Binding("visible", "isWas"),
                    	new go.Binding("geometry", "histogram", function(histogram) {
                    		if ( histogram["Slow"] === 0 ) return go.Geometry.parse("M30 0");
                    		var sum = 0;
                    		jQuery.each( histogram, function( key, value ) {
                				sum += value;
                			});
                    		return go.Geometry.parse("M30 0 B270 " + (calcuResponseSummaryCircleSize.maxSize - calcuResponseSummaryCircleSize(sum, histogram["Error"])) + " 30 30 30 30");
                    	})
                    ),
                    self.$(
                    	go.Shape, {
                    		stroke : self.$(go.Brush, go.Brush.Linear, { "0.0": "lightgreen", "1.0": "green"}),
                    		strokeWidth: 4,
                    		margin : new go.Margin( -28, 0, 0, 0 ),
                    		visible: true
                    	},
                    	new go.Binding("visible", "isWas"),
                    	new go.Binding("geometry", "histogram", function(histogram) {
                    		var sum = 0;
                    		jQuery.each( histogram, function( key, value ) {
                				sum += value;
                			});
                    		var size = calcuResponseSummaryCircleSize.maxSize - calcuResponseSummaryCircleSize(sum, histogram["Slow"]) - calcuResponseSummaryCircleSize(sum, histogram["Error"]);
                    		if ( size >= 180 ) {
                    			return go.Geometry.parse("M30 0 B270 " + size + " 30 30 30 30");
                    		} else {
                    			return go.Geometry.parse("M30 -60 B270 " + size + " 30 -30 30 30");
                    		}
                   			
                    	})
                    ),
                    self.$(
                        go.Panel,
                        go.Panel.Spot,
                        {
                        	name: "NODE_PANEL",
                            alignment: go.Spot.TopLeft,
                            alignmentFocus: go.Spot.TopLeft
                        },
                        self.$(
                            go.Panel,
                            go.Panel.Vertical,
                            {
                                alignment: go.Spot.TopLeft,
                                alignmentFocus: go.Spot.TopLeft,
                                minSize: new go.Size(120, NaN)
                            },
                            self.$(
                                go.Picture,
                                {
                                    source: sImageDir + sImageName,
                                    margin: new go.Margin(18, 0, 5, 0),
                                    desiredSize: new go.Size(80, 40),
                                    imageStretch: go.GraphObject.Uniform
                                }
                            ),
                            self.$(
                                go.TextBlock,
                                new go.Binding("text", "applicationName").makeTwoWay(),
                                {
                                    alignment: go.Spot.BottomCenter,
                                    alignmentFocus: go.Spot.BottomCenter,
                                    name: "NODE_TEXT",
                                    margin: 6,
//                                    margin: new go.Margin(6,16, -10, 16),
//                                    margin: new go.Margin(16,6, -6, 6),
                                    font: self.option('sBigFont'),
//                                    wrap: go.TextBlock.WrapFit,
//                                    width: 130,
                                    editable: false
                                }
                            ),

                            // http://www.gojs.net/latest/samples/entityRelationship.html
                            // http://www.gojs.net/latest/samples/records.html
                            self.$(
                                go.Panel,
                                go.Panel.Table,
                                {
                                    padding: 2,
                                    minSize: new go.Size(100, 10),
                                    defaultStretch: go.GraphObject.Horizontal,
                                    itemTemplate: infoTableTemplate
                                },
                                new go.Binding("itemArray", "infoTable")
                            )
                        ),
                        self.$(
                            go.Panel,
                            go.Panel.Horizontal,
                            {
                                alignment: go.Spot.TopLeft,
                                alignmentFocus: go.Spot.TopLeft,
                                margin: 0
                            },
                            self.$(
                                go.Picture,
                                {
                                    source: sImageDir + 'ERROR.png',
                                    desiredSize: new go.Size(20, 20),
//                                    visible: false,
                                    imageStretch: go.GraphObject.Uniform,
                                    margin: new go.Margin(1, 5, 0, 1)
                                },
                                new go.Binding("visible", "hasAlert")
                            ),
                            self.$(
                                go.Picture,
                                {
                                    source: sImageDir + 'FILTER.png',
                                    desiredSize: new go.Size(17, 17),
                                    visible: false,
                                    imageStretch: go.GraphObject.Uniform
                                },
                                new go.Binding("visible", "isFiltered")
                            )
                        ),
                        self.$(
                            go.Panel,
                            go.Panel.Auto,
                            {
                                alignment: go.Spot.TopRight,
                                alignmentFocus: go.Spot.TopRight,
                                visible: false
                            },
                            new go.Binding("visible", "instanceCount", function (v) {
                                return v > 1 ? true : false;
                            }),
                            self.$(
                                go.Shape,
                                {
                                    figure: "RoundedRectangle",
                                    fill: "#848484",
                                    strokeWidth: 1,
                                    stroke: "#848484"
                                }
                            ),
                            self.$(
                                go.Panel,
                                go.Panel.Auto,
                                {
                                    margin: new go.Margin(0, 3, 0, 3)
                                },
                                self.$(
                                    go.TextBlock,
                                    new go.Binding("text", "instanceCount"),
                                    {
                                        stroke: "#FFFFFF",
                                        textAlign: "center",
                                        height: 16,
                                        font: self.option('sSmallFont'),
                                        editable: false
                                    }
                                )
                            )
                        )
                    )
                );
            };

            var unknownTableTemplate = self.$(
                go.Panel,
                go.Panel.TableRow,
                self.$(
                    go.Picture, {
                        source: sImageDir + 'ERROR.png',
                        margin: new go.Margin(1, 2),
                        desiredSize: new go.Size(10, 10),
                        visible: false,
                        column: 1,
                        imageStretch: go.GraphObject.Uniform
                    },
                    new go.Binding("visible", "hasAlert")
                ),
                self.$(
                	go.TextBlock, {
                		name:"NODE_INDEX",
                		visible: false,
                		text : "0"
                	},
                	new go.Binding("text", "idx")
                ),
                self.$(
                    go.TextBlock, {
                    	name: "NODE_APPLICATION_NAME",
                        margin: new go.Margin(1, 2),
                        column: 2,
                        font: self.option('sSmallFont'),
                        alignment: go.Spot.Left,
                        click : function(e, obj ) {
                        	e.bubbles = false;
                        	if ( obj.part.data.isCollapse ) {
                        		self._onNodeClicked(e, obj, obj.part.data.unknownNodeGroup[e.targetObject.row].key);
                        	} else {
                        		var groupData = obj.part.data.subGroup[parseInt( e.targetObject.panel.findObject("NODE_INDEX").text )];
                        		self._onNodeSubGroupClicked(e, obj, groupData["groups"][e.targetObject.row].key, groupData.applicationName);
                        	}
                        	return false;
                        }
                        
                    },
                    new go.Binding('text', 'applicationName')
                ),
                self.$(
                    go.TextBlock, {
                        margin: new go.Margin(1, 2),
                        column: 3,
                        alignment: go.Spot.Right,
                        font: self.option('sSmallFont')
                    },
                    new go.Binding('text', 'totalCount', function (val) {
                        return Number(val, 10).toLocaleString();
                    })
                )
            );
            var subGroupTemplate = self.$(
                go.Panel,
                go.Panel.Vertical,
                self.$(
                    go.TextBlock, {
                    	name: "NODE_SUB_APPLICATION_NAME",
                        margin: new go.Margin(2, 2),
                        font: "bold 16px avn55,NanumGothic,ng,dotum,AppleGothic,sans-serif"
                    },
                    new go.Binding('text', 'applicationName')
                ),
                self.$(
                	go.Panel,
                	go.Panel.Table, {
                        padding: 4,
                        minSize: new go.Size(100, 10),
                        defaultStretch: go.GraphObject.Horizontal,
                        itemTemplate: unknownTableTemplate,
                        name: "NODE_SUB_TABLE"
                    },
                    new go.Binding( "itemArray", "groups" )
                ),
                self.$(
                    go.Shape, {
                        figure: "RoundedRectangle",
                        margin: new go.Margin(6, 2, 6, 2),
                        height: 1,
                        width: 200,
                        strokeWidth: 1,
                        stroke: "#F5A623",
                        fill: "#F5A623",
                        visible: true
                    },
                    new go.Binding("visible", "isLast", function(v) {
                    	return !v;
                    })
                )
            );

            var getUnknownGroupTemplate = function (sImageName) {
                return self.$(
                    go.Node,
                    go.Panel.Auto, {
                        selectionAdorned: false,
                        cursor: "pointer",
                        name: "NODE",
                        click: function (e, obj) {
                            if (e.bubbles) {
                                self._onNodeClicked(e, obj);
                            }
                        },
                        doubleClick: function(e, obj) {
                        	self._onNodeDoubleClicked(e, obj);
                        },
                        contextClick: self._onNodeContextClicked.bind(self)
                    },
                    self.$(
                        go.Shape, {
                            figure: "RoundedRectangle",
                            isPanelMain: true,
                            minSize: new go.Size(100, 100),
                            name: "NODE_SHAPE",
                            portId: "",
                            strokeWidth: self.option('htNodeTheme')["default"].borderWidth,
                            stroke: self.option('htNodeTheme')["default"].borderColor,
                            fill: self.option('htNodeTheme')["default"].backgroundColor
                        },                        
                        new go.Binding("key", "key")
                    ),
                    self.$( "Button", {
                    	alignment: go.Spot.TopLeft,
                    	width: 20,
                    	height: 20,
                    	margin: 2,
                    	visible : false,
                    	click: function(e, o) {
                    		self.analyticsService.send(self.analyticsService.CONST.MAIN, self.analyticsService.CONST.TG_NODE_VIEW);
                    		e.bubbles = false;
                    		var isCollapse = o.part.data.isCollapse;
                    		self._oDiagram.model.setDataProperty( o.part.data, "isCollapse", !isCollapse );
                    		o.part.findObject("GROUP_BUTTON").text = isCollapse ? " - " : " + ";
                    	}},
                    	new go.Binding( "visible", "isMultiGroup" ),
                    	self.$(
                    		go.TextBlock, {
	                    		name: "GROUP_BUTTON",
	                    		text: " + ",
	                    		textAlign: "center",
	                    		font: "bold 14px serif"
                    		}
                    	)
                    ),
                    self.$(
                        go.Panel,
                        go.Panel.Spot,
                        self.$(
                            go.Panel,
                            go.Panel.Vertical, {
                                alignment: go.Spot.TopLeft,
                                alignmentFocus: go.Spot.TopLeft,
                                minSize: new go.Size(130, NaN)
                            },
                            self.$(
                                go.Picture, {
                                    source: sImageDir + sImageName,
                                    margin: new go.Margin(0, 0, 5, 0),
                                    desiredSize: new go.Size(100, 40),
                                    imageStretch: go.GraphObject.Uniform
                                }
                            ),
                            self.$(
                                go.Panel,
                                go.Panel.Table, {
                                    padding: 2,
                                    minSize: new go.Size(100, 10),
                                    defaultStretch: go.GraphObject.Horizontal,
                                    itemTemplate: unknownTableTemplate,
                                    name: "NODE_TEXT",
                                    visible: true
                                },
                                new go.Binding("itemArray", "unknownNodeGroup"),
                                new go.Binding("visible", "isCollapse")
                            ),
                            self.$(
                                go.Panel,
                                go.Panel.Vertical, {
                                    padding: 2,
                                    minSize: new go.Size(100, 10),
                                    defaultStretch: go.GraphObject.Horizontal,
                                    itemTemplate: subGroupTemplate,
                                    name: "NODE_SUB_TEXT",
                                    visible: true
                                },
                                new go.Binding("itemArray", "subGroup"),
                                new go.Binding("visible", "isCollapse", function(v) {
                                	return !v;
                                })
                            )
                        )
                    ),
                    self.$(
                        go.Panel,
                        go.Panel.Auto, {
                            alignment: go.Spot.TopRight,
                            alignmentFocus: go.Spot.TopRight,
                            visible: false
                        },
                        new go.Binding("visible", "instanceCount", function (v) {
                            return v > 1 ? true : false;
                        }),
                        self.$(
                            go.Shape, {
                                figure: "RoundedRectangle",
                                fill: "#848484",
                                strokeWidth: 1,
                                stroke: "#848484"
                            }
                        ),
                        self.$(
                            go.Panel,
                            go.Panel.Auto, {
                                margin: new go.Margin(0, 3, 0, 3)
                            },
                            self.$(
                                go.TextBlock,
                                new go.Binding("text", "instanceCount"), {
                                    stroke: "#FFFFFF",
                                    textAlign: "center",
                                    height: 16,
                                    font: self.option('sSmallFont'),
                                    editable: false
                                }
                            )
                        )
                    )
                );
            };

            _.each(htIcons, function (sVal, sKey) {
            	if ( sKey.indexOf( "_GROUP" ) != -1 ) {
                    this._oDiagram.nodeTemplateMap.add(sKey, getUnknownGroupTemplate(sVal));
                } else {
                    this._oDiagram.nodeTemplateMap.add(sKey, getNodeTemplate(sVal));
                }
            }, this);

        },

        /**
         * initialize link templates
         *
         * @method ServerMap#_initLinkTemplates
         */
        _initLinkTemplates: function () {
            var self = this,
                htLinkType = this.option('htLinkType'),
                option = {
                    selectionAdorned: false,
                    // selectionAdornmentTemplate: this._oDefaultAdornmentForLink,
//                    click: this._onLinkClicked.bind(this),
                    contextClick: this._onLinkContextClicked.bind(this),
                    layerName: "Foreground",
                    reshapable: false, // to disable reshape on links

                    // fromSpot: go.Spot.RightSide,
                    // toSpot: go.Spot.LeftSide,

                    // routing: go.Link[htLinkType.sRouting],
                    // routing : go.Link.Normal,
                    // routing: go.Link.Orthogonal,
                    // routing: go.Link.AvoidsNodes,

                    corner: 10,
                    cursor: "pointer"

                    // curve: go.Link[htLinkType.sCurve],
                    // curve: go.Link.JumpOver
                    // curve: go.Link.JumpGap
                    // curve: go.Link.Bezier
                },
                htLinkTheme = this.option("htLinkTheme"),
                sImageDir = this.option('sImageDir'),
                htDefault = htLinkTheme["default"],
                bad = htLinkTheme.bad;

            var getLinkTemplate = function (htOption) {
                return self.$(
                    go.Link,  // the whole link panel
                    // { routing: go.Link.Normal, curve: go.Link.Bezier, toShortLength: 2 },
                    option,
                    new go.Binding("routing", "routing", function (val) {
                        return go.Link[val];
                    }),
                    new go.Binding("curve", "curve", function (val) {
                        return go.Link[val];
                    }),
                    new go.Binding("curviness", "curviness"),
                    self.$(
                        go.Shape,  // the link shape
                        {
                            name: "LINK",
                            isPanelMain: true,
                            stroke: htOption.borderColor,
                            strokeWidth: 1.5
                        }
                    ),
                    self.$(
                        go.Shape,  // the arrowhead
                        {
                            name: "ARROW",
                            toArrow: "standard",  // toArrow : kite, standard, OpenTriangle
                            fill: htOption.borderColor,
                            stroke: null,
                            scale: 1.5
                        }
                    ),
                    self.$(
                        go.Panel,
                        go.Panel.Auto,
                        self.$(
                            go.Shape,  // the link shape
                            "RoundedRectangle",
                            {
                                name: "LINK2",
                                fill: "#ffffff",
                                stroke: "#ffffff",
                                portId: "",
                                fromLinkable: true,
                                toLinkable: true
                            }
                        ),
                        self.$(
                            go.Panel,
                            go.Panel.Horizontal,
                            {
                                margin: 4
                            },
                            self.$(
                                go.Picture,
                                {
                                    source: sImageDir + 'FILTER.png',
                                    width: 14,
                                    height: 14,
                                    margin: 1,
                                    visible: false,
                                    imageStretch: go.GraphObject.Uniform
                                },
                                new go.Binding("visible", "isFiltered")
                            ),
                            self.$(
                                go.TextBlock,  // the label
                                {
                                	name: "LINK_TEXT",
                                    textAlign: htOption.fontAlign,
                                    font: htOption.fontFamily,
                                    margin: htOption.margin
                                },
//                                new go.Binding("text", "count", function (val) {
                                new go.Binding("text", "totalCount", function (val) {
                                    return Number(val, 10).toLocaleString();
                                }) ,
                                new go.Binding("stroke", "hasAlert", function (hasAlert) {
                                    return (hasAlert) ? bad.fontColor : htDefault.fontColor;
                                })
                            )
                        )
                    )
                );
            };

            this._oDiagram.linkTemplate = getLinkTemplate(htDefault);

            _.each(htLinkTheme, function (sVal, sKey) {
                if (sKey === "default") {
                    return;
                }
                this._oDiagram.linkTemplateMap.add(sKey, getLinkTemplate(sVal));
            }, this);
        },

        /**
         * initialize diagrams
         *
         * @method ServerMap#_initDiagramEnvironment
         */
        _initDiagramEnvironment: function () {
            var htPadding = this.option('htPadding');
            // have mouse wheel events zoom in and out instead of scroll up and
            // down
            this._oDiagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
            this._oDiagram.allowDrop = false;

            // read in the JSON-format data from the "mySavedModel" element
            this._oDiagram.initialAutoScale = go.Diagram.Uniform; // None,
            // Uniform,
            // UniformToFill
            // this._oDiagram.toolManager.linkingTool.direction =
            // go.LinkingTool.ForwardsOnly;
            this._oDiagram.toolManager.draggingTool.doCancel();
            this._oDiagram.toolManager.draggingTool.doDeactivate();
            this._oDiagram.toolManager.dragSelectingTool.isEnabled = false;
            this._oDiagram.initialContentAlignment = go.Spot.Center;
            this._oDiagram.padding = new go.Margin(htPadding.top, htPadding.right, htPadding.bottom, htPadding.left);
            this._oDiagram.layout = this.$(
            	go.LayeredDigraphLayout,
                { // rdirection: 90,
                    isOngoing: false,
                    layerSpacing: 100,
                    columnSpacing: 30,
                    setsPortSpots: false
                    // packOption : 7 // sum of 1(PackExpand), 2(PackStraighten), 4(PackMedian)

// direction : 0,
// cycleRemoveOption : go.LayeredDigraphLayout.CycleDepthFirst,
// layeringOption : go.LayeredDigraphLayout.LayerOptimalLinkLength,
// initializeOption : go.LayeredDigraphLayout.InitDepthFirstOut,
// aggressiveOption : go.LayeredDigraphLayout.AggressiveLess,
// packOption : 7,
// setsPortSpots : true
                }
            );

            var self = this;
            // whenever selection changes, run updateHighlights
            this._oDiagram.addDiagramListener("ChangedSelection", function (e) {
                var selection = self._oDiagram.selection.first();
                if (selection) {
                    if (selection instanceof go.Node) {
                        if (!self.nodeClickEventOnce) {
                            self._onNodeClicked(e, selection);
                            self.nodeClickEventOnce = true;
                        }
                    } else if (selection instanceof go.Link) {
                        self._onLinkClicked(e, selection);
                    }
                }
                self._updateHightlights();
            });
            this._oDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
                var fOnBackgroundClicked = self.option('fOnBackgroundClicked');
                if (angular.isFunction(fOnBackgroundClicked)) {
                    fOnBackgroundClicked.call(self, e);
                }
            });
            this._oDiagram.addDiagramListener("BackgroundDoubleClicked", function (e) {
                var fOnBackgroundDoubleClicked = self.option('fOnBackgroundDoubleClicked');
                if (angular.isFunction(fOnBackgroundDoubleClicked)) {
                    fOnBackgroundDoubleClicked.call(self, e);
                }
            });
            this._oDiagram.addDiagramListener("BackgroundContextClicked", function (e) {
                var fOnBackgroundContextClicked = self.option('fOnBackgroundContextClicked');
                if (angular.isFunction(fOnBackgroundContextClicked)) {
                    fOnBackgroundContextClicked.call(self, e);
                }
            });
        },
        /**
         * initialize Overview
         *
         * @method ServerMap#_initOverview
         */
        _initOverview: function ( $location ) {
        	
        	if ( /^\/main/.test( $location.path() ) ) {
	            this._oOverview = this.$( go.Overview,
	            		this.option('sOverviewId'),
	            		{ observed: this._oDiagram }
	            );
	            this._oOverview.box.elt(0).figure = "RoundedRectangle";
	            this._oOverview.box.elt(0).stroke = "#53069B";
	            this._oOverview.box.elt(0).strokeWidth = 4;
	        } else {
	        	$( "#" + this.option('sOverviewId') ).hide();
	        }
        },

        /**
         * load
         *
         * @method ServerMap#load
         * @param {object}
         */
        load: function (str) {
            this.nodeClickEventOnce = false;
            this._sLastModelData = str;
            this._oDiagram.model = go.Model.fromJson(str);
            this._oDiagram.undoManager.isEnabled = true;
        },

        /**
         * clear diagram
         *
         * @method ServerMap#clear
         */
        clear: function () {
            this._oDiagram.model = go.Model.fromJson({});
        },

        /**
         * reset highlights
         *
         * @method ServerMap#_resetHighlights
         */
        _resetHighlights: function () {
        	var allNodes = this._oDiagram.nodes;
            var allLinks = this._oDiagram.links;
            while (allNodes.next()) {
                allNodes.value.highlight = false;
            }
            while (allLinks.next()) {
                allLinks.value.highlight = false;
            }
        },

        /**
         * update highlights
         *
         * @method ServerMap#_updateHighlights
         * @param {go.Node} selection
         */
        _updateHightlights: function (selection) {
            selection = selection || this._oDiagram.selection.first();
            if (selection === null) {
                return;
            }

            this._resetHighlights();
            selection.highlight = 'self';
            if (selection instanceof go.Node) {
                this._linksTo(selection, 'from');
                this._linksFrom(selection, 'to');
            } else if (selection instanceof go.Link) {
                this._nodesTo(selection, 'from');
                this._nodesFrom(selection, 'to');
            }

            // iterators containing all nodes and links in the diagram
            var allNodes = this._oDiagram.nodes,
                allLinks = this._oDiagram.links;

            // nodes, including groups
            while (allNodes.next()) {
                this._highlightNode(allNodes.value.findObject("NODE_SHAPE"), allNodes.value.findObject("NODE_TEXT"), allNodes.value.highlight);
            }
            // links
            while (allLinks.next()) {
                this._highlightLink(allLinks.value.findObject("LINK"), allLinks.value.highlight);
//                this._highlightLink(allLinks.value.findObject("LINK2"), allLinks.value.highlight);
                this._highlightLink(allLinks.value.findObject("ARROW"), allLinks.value.highlight, true);
                this._highlightLinkText(allLinks.value.findObject("LINK_TEXT"), allLinks.value.highlight);
            }
        },

        /**
         * highlight node by node key
         *
         * @method ServerMap#highlightNodeByKey
         * @param {String} sKey node key
         */
        highlightNodeByKey: function (sKey) {
            var node = this._oDiagram.findNodeForKey(sKey);
            if (node) {
                var part = this._oDiagram.findPartForKey(sKey);
                this._oDiagram.select(part);
                this._updateHightlights(node);
                //console.log( this._oDiagram.documentBounds, this._oDiagram.scale );
                //this._oDiagram.zoomToRect( {
                //    x: part.actualBounds.x - part.actualBounds.width * 3,
                //    y: part.actualBounds.y - part.actualBounds.height * 3,
                //    width: part.actualBounds.width * 6,
                //    height: part.actualBounds.height * 6,
                //}, this._oDiagram.UniformToFill );
            }
        },

        /**
         * highlight link by from, to objects
         *
         * @method ServerMap#highlightLinkByFromTo
         * @param {String} from
         * @param {String} to
         */
        highlightLinkByFromTo: function (from, to) {
            var htLink = this._getLinkObjectByFromTo(from, to);
            if (htLink) {
                this._oDiagram.select(this._oDiagram.findPartForData(htLink));
                this._updateHightlights(this._oDiagram.findLinkForData(htLink));
            }
        },

        /**
         * get link by from, to objects
         *
         * @method ServerMap#_getLinkObjectByFromTo
         * @param {String} from
         * @param {String} to
         */
        _getLinkObjectByFromTo: function (from, to) {
            var aLink = this._oDiagram.model.linkDataArray;
            for (var i = 0, len = aLink.length; i < len; i += 1) {
                var htLink = aLink[i];
                if (htLink.from === from && htLink.to === to) {
                    return htLink;
                }
            }
            return false;
        },

        /**
         * highlight node
         * ServerMap#_highlightNode
         * @param nodeShape
         * @param nodeText
         * @param theme
         * @private
         */
        _highlightNode: function (shapeNode, textNode, theme) {
            if (shapeNode === null || textNode === null) {
                return;
            }
			var i = 0;
            if (theme) {
            	shapeNode.stroke = this.option('htHighlightNode').borderColor;
            	shapeNode.strokeWidth = 2;
            	shapeNode.part.isShadowed = true;
            	
            	var reg = new RegExp( this._query, "i" );
            	var highlightFont = this.option('htHighlightNode').fontColor;
            	var defaultFont = this.option('htNodeTheme')["default"].fontColor;
                if ( this._query !== "" ) {
	                if ( angular.isDefined( textNode.rowCount ) ) {
	                	for( i = 0 ; i < textNode.rowCount ; i++ ) {
	                		var innerTextNode = textNode.elt(i).elt(2);
	                		innerTextNode.stroke = reg.test( innerTextNode.text ) ? highlightFont : defaultFont;
	                	}
	                	
	                	var nodeSubTextNode = textNode.panel.findObject("NODE_SUB_TEXT");
	                	var length = nodeSubTextNode.elements.count;
	                	for( i = 0 ; i < length ; i++ ) {
	                		var innerTableNode = nodeSubTextNode.elt(i).elt(1); 
                			for( var j = 0 ; j < innerTableNode.elements.count ; j++ ) {
                				var innerSubTextNode = innerTableNode.elt(j).elt(2);
                				innerSubTextNode.stroke = reg.test( innerSubTextNode.text ) ? highlightFont : defaultFont;
                			}
	                	}
	                } else {
	                	textNode.stroke = reg.test( textNode.text ) ? highlightFont : defaultFont; 
	                }
                }
            } else {
                var type = (shapeNode.key === this.option('sBoldKey')) ? 'bold' : 'default';
                shapeNode.stroke = this.option('htNodeTheme')[type].borderColor;
                shapeNode.strokeWidth = 1;
                shapeNode.part.isShadowed = false;

                if ( angular.isDefined( textNode.rowCount ) ) {                	
                	for( i = 0 ; i < textNode.rowCount ; i++ ) {
                		textNode.elt(i).elt(2).stroke = this.option('htNodeTheme')[type].fontColor;
                	}
                } else {
                	textNode.stroke = this.option('htNodeTheme')[type].fontColor;
                }
            }
        },

        /**
         * highlight link
         * @method ServerMap#_highlightLink
         * @param shape
         * @param theme
         * @private
         */
        _highlightLink: function (shape, theme, toFill) {
            if (shape === null) {
                return;
            }
            var color;
            if (theme) {
                color = this.option('htHighlightLink').borderColor;
                shape.strokeWidth = this.option('htHighlightLink').strokeWidth;
            } else {
                color = this.option('htLinkTheme')["default"].borderColor;
                shape.strokeWidth = this.option('htLinkTheme')["default"].strokeWidth;
            }
            if (toFill) {
                shape.fill = color;
            } else {
                shape.stroke = color;
            }
        },
        _highlightLinkText: function( nodeText, highlight ) {
        	if ( highlight ) {
        		nodeText.font = this.option('htHighlightLink').fontFamily;
        	} else {
        		nodeText.font = this.option('htLinkTheme')["default"].fontFamily;
        	}
        },

        /**
         * if the link connects to this node, highlight it
         *
         * @method ServerMap#_linksTo
         * @param {go.Node} x
         * @param {Number} i
         */
        _linksTo: function (x, i) {
            if (x instanceof go.Node) {
                var links = x.findLinksInto();
                while (links.next()) {
                    links.value.highlight = i;
                }
            }
        },

        /**
         * if the link comes from this node, highlight it
         *
         * @method ServerMap#_linksFrom
         * @param {go.Node} x
         * @param {Number} i
         */
        _linksFrom: function (x, i) {
            if (x instanceof go.Node) {
                var links = x.findLinksOutOf();
                while (links.next()) {
                    links.value.highlight = i;
                }
            }
        },

        /**
         * if selected object is a link, highlight its fromNode, otherwise,
         * highlight the fromNode of each link coming into the selected node
         *
         * @method ServerMap#_nodesTo
         * @param {go.Node} x
         * @param {Number} i
         * @return a List of the keys of the nodes
         */
        _nodesTo: function (x, i) {
            var nodesToList = new go.List("string");
            if (x instanceof go.Link) {
                x.fromNode.highlight = i;
                nodesToList.add(x.data.from);
            } else {
                var nodes = x.findNodesInto();
                while (nodes.next()) {
                    nodes.value.highlight = i;
                    nodesToList.add(nodes.value.data.key);
                }
            }
            return nodesToList;
        },

        /**
         * same as nodesTo, but from instead of to
         *
         * @method ServerMap#_nodesFrom
         * @param {go.Node} x
         * @param {Number} i
         */
        _nodesFrom: function (x, i) {
            var nodesFromList = new go.List("string");
            if (x instanceof go.Link) {
                x.toNode.highlight = i;
                nodesFromList.add(x.data.to);
            } else {
                var nodes = x.findNodesOutOf();
                while (nodes.next()) {
                    nodes.value.highlight = i;
                    nodesFromList.add(nodes.value.data.key);
                }
            }
            return nodesFromList;
        },
        /**
         * event of merge group node click 
         *
         * @method ServerMap#_onNodeSubGroupClicked
         * @param {Event} e
         * @param {ojb} ojb
         * @param {String} unknownKey
         * @param {String} fromName
         */
        _onNodeSubGroupClicked: function(e, obj, unknownKey, fromName) {
            var node = obj.part,
            fOnNodeSubGroupClicked = this.option('fOnNodeSubGroupClicked');
	        if (angular.isFunction(fOnNodeSubGroupClicked)) {
	        	this.analyticsService.send(this.analyticsService.CONST.MAIN, this.analyticsService.CONST.CLK_NODE);
	        	fOnNodeSubGroupClicked.call(this, e, node, unknownKey, fromName);
	        }
        },
        /**
         * event of node click
         *
         * @method ServerMap#_onNodeClicked
         * @param {Event} e
         * @param {ojb} ojb
         * @param {String} unknownKey
         */
        _onNodeClicked: function (e, obj, unknownKey, query) {
            var node = obj.part,
                htData = node.data,
                fOnNodeClicked = this.option('fOnNodeClicked');
            if (angular.isFunction(fOnNodeClicked)) {
				if ( e.clickCount > 0 ) {
					this.analyticsService.send(this.analyticsService.CONST.MAIN, this.analyticsService.CONST.CLK_NODE);
				}
                fOnNodeClicked.call(this, e, htData, unknownKey, query);
            }
        },
        /**
         * event of node doubleclick
         *
         * @method ServerMap#_onNodeDoubleClicked
         * @param {Event} e
         * @param {ojb} ojb
         */
        _onNodeDoubleClicked: function(e, obj) {
            var node = obj.part,
            htData = node.data,
            fOnNodeDoubleClicked = this.option('fOnNodeDoubleClicked');
	        if (angular.isFunction(fOnNodeDoubleClicked)) {
	            fOnNodeDoubleClicked.call(this, e, node, htData);
	        }        	
        },

        /**
         * event of node context click
         *
         * @method ServerMap#_onNodeContextClick
         * @param {Event} e
         * @param {ojb} ojb
         */
        _onNodeContextClicked: function (e, obj) {
            var node = obj.part,
                htData = node.data,
                fOnNodeContextClicked = this.option('fOnNodeContextClicked');
            if (angular.isFunction(fOnNodeContextClicked)) {
                fOnNodeContextClicked.call(this, e, htData);
            }
        },

        /**
         * event of link click
         *
         * @method ServerMap#_onLinkClicked
         * @param {Event} e
         * @param {ojb} ojb
         */
        _onLinkClicked: function (e, obj) {
            var link = obj.part,
                htData = link.data,
                fOnLinkClicked = this.option('fOnLinkClicked');
            if (angular.isFunction(fOnLinkClicked)) {
            	this.analyticsService.send(this.analyticsService.CONST.MAIN, this.analyticsService.CONST.CLK_LINK);
                htData.fromNode = obj.fromNode.part.data;
                htData.toNode = obj.toNode.part.data;
                fOnLinkClicked.call(this, e, htData);
            }
        },

        /**
         * event of link context click
         *
         * @method ServerMap#_onLinkContextClicked
         * @param {Event} e
         * @param {ojb} ojb
         */
        _onLinkContextClicked: function (e, obj) {
            var link = obj.part,
                htData = link.data,
                fOnLinkContextClicked = this.option('fOnLinkContextClicked');
            if (angular.isFunction(fOnLinkContextClicked)) {
                htData.fromNode = obj.fromNode.part.data;
                htData.toNode = obj.toNode.part.data;
                fOnLinkContextClicked.call(this, e, htData);
            }
        },

        refresh: function () {
//            while (this._oDiagram.undoManager.canUndo()) {
//                this._oDiagram.undoManager.undo();
//            }
//            this._oDiagram.zoomToFit();
            this.load(this._sLastModelData);
        },
        zoomToFit: function () {
            this._oDiagram.zoomToFit();
            this._oDiagram.contentAlignment = go.Spot.Center;
            this._oDiagram.contentAlignment = go.Spot.None;
        },
        clearQuery: function() {
        	this._query = "";
        },
        searchNode: function( query, nodeServiceType ) {
        	this._query = query;
        	var allNodes = this._oDiagram.nodes,
        		selectedNode = null,
        		selectedIndex = 0,
        		similarNodeList = [],
        		returnNodeDataList = [],
        		reg = new RegExp( query, "i" );
        	
            while (allNodes.next()) {
                var node = allNodes.value;
                if ( node.data.unknownNodeGroup ) {
                	var unknownNodeGroup = node.data.unknownNodeGroup;
                	for( var i = 0; i < unknownNodeGroup.length ; i++ ) {
                		if ( reg.test( unknownNodeGroup[i].applicationName ) ) {
                			this._addNodeToTemporaryList( similarNodeList, returnNodeDataList, node, unknownNodeGroup[i], this.option("unknownGroupName") );
                		}
                	}
                } else {
	                if ( !angular.isUndefined( node.data.applicationName ) ) {
		                if ( reg.test( node.data.applicationName ) ) {
		                	this._addNodeToTemporaryList( similarNodeList, returnNodeDataList, node, node.data );
		                }
	                }
                }
            }
           	this._selectAndHighlight( similarNodeList[selectedIndex] );
            if ( angular.isUndefined ( nodeServiceType ) ) {
            	return returnNodeDataList;
            }
        },
        _addNodeToTemporaryList : function( similarNodeList, returnNodeDataList, node, nodeData, serviceType ) {
        	similarNodeList.push( node );
    		returnNodeDataList.push({
        		applicationName: nodeData.applicationName,
        		serviceType: serviceType || nodeData.serviceType
        	});
        },
        _selectAndHighlight : function( selectedNode ) {
        	this._oDiagram.clearSelection();
        	this._oDiagram.select( selectedNode );
            this._oDiagram.centerRect( selectedNode.actualBounds );
            this._onNodeClicked(null, selectedNode, null, this._query );
        }
    });

})(window, go, jQuery, _);
