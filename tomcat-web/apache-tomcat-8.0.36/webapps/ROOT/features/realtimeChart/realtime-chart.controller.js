(function($) {
	'use strict';
	/**
	 * (en)RealtimeChartCtrl 
	 * @ko RealtimeChartCtrl
	 * @group Controller
	 * @name RealtimeChartCtrl
	 * @class
	 */
	pinpointApp.constant('RealtimeChartCtrlConfig', {
		sendPrefix: "applicationName=",
		keys: {
			CODE: "code",
			TYPE: "type",
			RESULT: "result",
			STATUS: "status",
			COMMAND: "command",
			MESSAGE: "message",
			TIME_STAMP: "timeStamp",
			PARAMETERS: "parameters",
			APPLICATION_NAME: "applicationName",
			ACTIVE_THREAD_COUNTS: "activeThreadCounts"
		},
		values: {
			PING: "PING",
			PONG: "PONG",
			REQUEST: "REQUEST",
			RESPONSE: "RESPONSE",
			ACTIVE_THREAD_COUNT: "activeThreadCount"
		},
		template: {
			agentChart: '<div class="agent-chart"><div></div></div>',
			chartDirective: Handlebars.compile( '<realtime-chart-directive timeout-max-count="{{timeoutMaxCount}}" chart-color="{{chartColor}}" xcount="{{xAxisCount}}" show-extra-info="{{showExtraInfo}}" request-label="requestLabelNames" namespace="{{namespace}}" width="{{width}}" height="{{height}}"></realtime-chart-directive>' )
		},
		css : {
			borderWidth: 2,
			height: 180,
			navbarHeight: 70,
			titleHeight: 30
		},
		sumChart: {
			width: 260,
			height: 120
		},
		otherChart: {
			width: 120,
			height: 60
		},
		const: {
			MIN_Y: 10
		}
	});
	
	pinpointApp.controller( "RealtimeChartCtrl", [ "RealtimeChartCtrlConfig", "$scope", "$element", "$rootScope", "$compile", "$timeout", "$window", "globalConfig", "$location", "RealtimeWebsocketService", "AnalyticsService", "TooltipService",
	    function (cfg, $scope, $element, $rootScope, $compile, $timeout, $window, globalConfig, $location, websocketService, analyticsService, tooltipService) {
	    	$element = $($element);
			//@TODO will move to preference-service 
	    	var TIMEOUT_MAX_COUNT = 10;
			var X_AXIS_COUNT = 10;
	    	var RECEIVE_SUCCESS = 0;

			var $elSumChartWrapper, $elTitle, $elSumChartCount, $elAgentChartListWrapper, $elWarningMessage, $elHandleGlyphicon, $elPin;
	    	var preUrlParam = "";
			var currentApplicationName = "";
	    	var aAgentChartElementList = [];
	    	var oNamespaceToIndexMap = {};
	    	var aSumChartData = [0];
	    	var bIsPinned = true;
	    	var bIsWas = false;
	    	var bIsFullWindow = false;
	    	var bShowRealtimeChart = true;
	    	var popupHeight = cfg.css.height;
	    	var wsPongTemplate = (function() {
	    		var o = {};
	    		o[cfg.keys.TYPE] = cfg.values.PONG;
	    		return JSON.stringify(o);
	    	})();
	    	var wsMessageTemplate = (function() {
	    		var o = {};
		    	o[cfg.keys.TYPE] = cfg.values.REQUEST;
		    	o[cfg.keys.COMMAND] = cfg.values.ACTIVE_THREAD_COUNT;
		    	o[cfg.keys.PARAMETERS] = {};
		    	return o;
	    	})();
			var timeoutResult = null;
			tooltipService.init( "realtime" );

	    	$scope.sumChartColor 	= ["rgba(44, 160, 44, 1)", 	"rgba(60, 129, 250, 1)", 	"rgba(248, 199, 49, 1)", 	"rgba(246, 145, 36, 1)" ];
	    	$scope.agentChartColor 	= ["rgba(44, 160, 44, .8)", "rgba(60, 129, 250, .8)", 	"rgba(248, 199, 49, .8)", 	"rgba(246, 145, 36, .8)"];
	    	$scope.requestLabelNames= [ "1s", "3s", "5s", "Slow"];
	    	$scope.bInitialized = false;

			$(document).on("visibilitychange", function() {
				switch ( document.visibilityState ) {
					case "hidden":
						timeoutResult = $timeout(function() {
							websocketService.close();
							timeoutResult = null;
						}, 60000);
						break;
					case "visible":
						if ( timeoutResult !== null ) {
							$timeout.cancel( timeoutResult );
						} else {
							$scope.retryConnection();
						}
						timeoutResult = null;
						break;
				}
			});
			initElements();
			function initElements() {
				$elSumChartWrapper = $element.find("div.agent-sum-chart");
				$elTitle = $element.find("div.agent-sum-chart div:first-child span:first-child");
				$elSumChartCount = $element.find("div.agent-sum-chart div:first-child span:last-child");
				$elAgentChartListWrapper = $element.find("div.agent-chart-list");
				$elWarningMessage = $element.find(".connection-message");
				$elHandleGlyphicon = $element.find(".handle .glyphicon");
				$elPin = $element.find(".glyphicon-pushpin");
				$elWarningMessage.hide();
				$elTitle.html("");
				$elSumChartCount.html("0");
			}

	    	function initChartDirective() {
	    		if ( hasAgentChart( "sum" ) === false ) {
		    		$elSumChartWrapper.append( $compile( cfg.template.chartDirective({
		    			"width": cfg.sumChart.width,
		    			"height": cfg.sumChart.height,
		    			"namespace": "sum",
		    			"chartColor": "sumChartColor",
		    			"xAxisCount": X_AXIS_COUNT,
		    			"showExtraInfo": "true",
		    			"timeoutMaxCount": TIMEOUT_MAX_COUNT
		    		}))($scope) );
		    		oNamespaceToIndexMap["sum"] = -1;
	    		}
	    	}
	    	function initNamespaceToIndexMap() {
	    		if ( angular.isDefined( oNamespaceToIndexMap["sum"] ) ) {
	    			oNamespaceToIndexMap = {};
		    		oNamespaceToIndexMap["sum"] = -1;
	    		} else {
	    			oNamespaceToIndexMap = {};
	    		}
	    	}
	    	function hasAgentChart( agentName ) {
	    		return angular.isDefined( oNamespaceToIndexMap[agentName] );
	    	}
	    	function addAgentChart( agentName ) {
	    		var $newAgentChart = $( cfg.template.agentChart ).append( $compile( cfg.template.chartDirective({
	    			"width": cfg.otherChart.width, 
	    			"height": cfg.otherChart.height,
	    			"namespace": aAgentChartElementList.length,
	    			"chartColor": "agentChartColor",
	    			"xAxisCount": X_AXIS_COUNT,
	    			"showExtraInfo": "false",
	    			"timeoutMaxCount": TIMEOUT_MAX_COUNT
	    		}))($scope) );
	    		$elAgentChartListWrapper.append( $newAgentChart );
	    		
	    		linkNamespaceToIndex( agentName, aAgentChartElementList.length );
	    		aAgentChartElementList.push( $newAgentChart );
	    	}
	        function initSend() {
	        	var bConnected = websocketService.open({
	        		onopen: function(event) {
	        			startReceive();
	        		},
	        		onmessage: function(data) {
						receive( data );
	        		},
	        		onclose: function(event) {
	        			$scope.$apply(function() {
	        				disconnectedConnection();
		            	});
	        		},
	        		ondelay: function() {
	        			websocketService.close();
	        		},
					retry: function() {
						$scope.retryConnection();
					}
	        	});
	        	if ( bConnected ) {
	        		initChartDirective();
	        	}
	        }
	        function receive( data ) {
				$elWarningMessage.hide();
	        	switch( data[cfg.keys.TYPE] ) {
	        		case cfg.values.PING:
	        			websocketService.send( wsPongTemplate );
	        			break;
	        		case cfg.values.RESPONSE:
		        		var responseData = data[cfg.keys.RESULT];
						if ( responseData[cfg.keys.APPLICATION_NAME] !== currentApplicationName ) return;
			        	
			        	var applicationData = responseData[cfg.keys.ACTIVE_THREAD_COUNTS];
			        	var aRequestSum = getSumOfRequestType( applicationData );
			        	addSumYValue( aRequestSum );
			        	
			        	broadcastData( applicationData, aRequestSum, responseData[cfg.keys.TIME_STAMP] );

	        			break;
	        	}
	        }
	        function broadcastData( applicationData, aRequestSum, timeStamp ) {
	        	var maxY = Math.max( getMaxOfYValue(), cfg.const.MIN_Y);
	        	var agentIndexAndCount = 0;
	        	var bAllError = true;
	        	
	        	for( var agentName in applicationData ) {
	        		checkAgentChart( agentName, agentIndexAndCount );
	        		
	        		if ( applicationData[agentName][cfg.keys.CODE] === RECEIVE_SUCCESS ) {
	        			bAllError = false;
	        			$scope.$broadcast('realtimeChartDirective.onData.' + oNamespaceToIndexMap[agentName], applicationData[agentName][cfg.keys.STATUS], timeStamp, maxY, bAllError );
	        		} else {
	        			$scope.$broadcast('realtimeChartDirective.onError.' + oNamespaceToIndexMap[agentName], applicationData[agentName], timeStamp, maxY );
	        		}
	        		
	        		showAgentChart( agentIndexAndCount );
	        		agentIndexAndCount++;
	        	}
        		$scope.$broadcast('realtimeChartDirective.onData.sum', aRequestSum, timeStamp, maxY, bAllError );
				$elSumChartCount.html(agentIndexAndCount);
	        }
	        function makeRequest( applicationName ) {
	        	wsMessageTemplate[cfg.keys.PARAMETERS][cfg.keys.APPLICATION_NAME] = applicationName;
	        	return JSON.stringify(wsMessageTemplate);
	        }
	        function checkAgentChart( agentName, agentIndexAndCount ) {
	        	if ( hasAgentChart( agentName ) === false ) {
        			if ( hasNotUseChart( agentIndexAndCount ) ) {
        				linkNamespaceToIndex(agentName, agentIndexAndCount);
        			} else {
	        			addAgentChart(agentName);
	        		}
        		}
        		setAgentName( agentIndexAndCount, agentName );
	        }
	        function linkNamespaceToIndex( name, index ) {
	        	oNamespaceToIndexMap[name] = index;	
	        }
	        function hasNotUseChart( index ) {
	        	return aAgentChartElementList.length > index;
	        }
	        function showAgentChart( index ) {
	        	aAgentChartElementList[index].show();
	        }
	        function setAgentName( index, name ) {
	        	aAgentChartElementList[index].find("div").html(name);
	        }
	        function getSumOfRequestType( datum ) {
	        	var aRequestSum = [0, 0, 0, 0];
	        	for( var p in datum ) {
	        		if ( datum[p][cfg.keys.CODE] === RECEIVE_SUCCESS ) {
	        			jQuery.each(datum[p][cfg.keys.STATUS], function( i, v ) {
	        				aRequestSum[i] += v;
	        			});
	        		}
	        	}
	        	return aRequestSum;
	        }
	        function addSumYValue( data ) {
	        	aSumChartData.push( data.reduce(function(pre, cur) {
	        		return pre + cur;
	        	}));
	        	if ( aSumChartData.length > X_AXIS_COUNT ) {
	        		aSumChartData.shift();
	        	}
	        }
	        function getMaxOfYValue() {
    	        return d3.max( aSumChartData, function( d ) {
	                return d;
	            });
    	    }
	        function startReceive() {
	        	websocketService.send( makeRequest( currentApplicationName) );
	        }
	        function initReceive() {
	        	if ( websocketService.isOpened() === false ) {
	        		initSend();
	        	} else {
	        		startReceive();
	        	}
        		bShowRealtimeChart = true;
	        }
	        function stopReceive() {
	        	bShowRealtimeChart = false;
        		websocketService.stopReceive( makeRequest("") );
	        }
	        function stopChart() {
	        	$rootScope.$broadcast('realtimeChartDirective.clear.sum');
	        	$.each( aAgentChartElementList, function(index, el) {
	        		$rootScope.$broadcast('realtimeChartDirective.clear.' + index);
	        		el.hide();
	        	});
	        }
	        function disconnectedConnection() {
	        	$elWarningMessage.css("background-color", "rgba(200, 200, 200, 0.9)");
	        	$elWarningMessage.find("h4").css("color", "red").html("Closed connection.<br/><br/>Select node again.");
	        	$elWarningMessage.find("button").show();
				$elWarningMessage.show();
	        }
	        function waitingConnection() {
	        	$elWarningMessage.css("background-color", "rgba(138, 171, 136, 0.5)");
	        	$elWarningMessage.find("h4").css("color", "blue").html("Waiting Connection...");
	        	$elWarningMessage.find("button").hide();
				$elWarningMessage.show();
	        }
	        function hidePopup() {
	        	$element.animate({
	        		bottom: -popupHeight,
	        		left: 0
	        	}, 500, function() {
	        		$elHandleGlyphicon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
	        	});
	        }
	        function showPopup() {
	        	$element.animate({
	        		bottom: 0,
	        		left: 0
	        	}, 500, function() {
	        		$elHandleGlyphicon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
	        	});
	        }
	        function adjustWidth() {
	        	$element.innerWidth( $element.parent().width() - cfg.css.borderWidth + "px" );
	        }
	        function setPinColor() {
	        	$elPin.css("color", bIsPinned ? "red": "");
	        }
	        $scope.$on( "realtimeChartController.close", function () {
	        	hidePopup();
	        	var prevShowRealtimeChart = bShowRealtimeChart;
	        	$scope.closePopup();
	        	bShowRealtimeChart = prevShowRealtimeChart;
	        	setPinColor();
	        });
	        $scope.$on( "realtimeChartController.initialize", function (event, was, applicationName, urlParam ) {
	        	if ( bIsPinned === true && preUrlParam === urlParam ) return;
	        	if ( /^\/main/.test( $location.path() ) === false ) return;
	        	bIsWas = angular.isUndefined( was ) ? false : was;
	        	applicationName = angular.isUndefined( applicationName ) ? "" : applicationName;
	        	preUrlParam = urlParam;

				initElements();
				$elTitle.html( currentApplicationName = applicationName );
	        	if ( globalConfig.useRealTime === false ) return;
	        	if ( bShowRealtimeChart === false ) return;
	        	if ( bIsWas === false ) {
	        		hidePopup();
	        		return;
	        	}
	        	initNamespaceToIndexMap();
	        	adjustWidth();
	        	$scope.bInitialized = true;
	        	
	        	showPopup();
	        	$scope.closePopup();
				$elTitle.html( currentApplicationName = applicationName );
        		waitingConnection();
        		
        		initReceive();
        		setPinColor();
	        });
	        $scope.retryConnection = function() {
	        	waitingConnection();
        		initReceive();
	        };
	        $scope.pin = function() {
	        	bIsPinned = !bIsPinned;
				analyticsService.send( analyticsService.CONST.MAIN, bIsPinned ? analyticsService.CONST.CLK_REALTIME_CHART_PIN_ON : analyticsService.CONST.CLK_REALTIME_CHART_PIN_OFF );
	        	setPinColor();
	        };
	        $scope.resizePopup = function() {
	        	analyticsService.send( analyticsService.CONST.MAIN, analyticsService.CONST.TG_REALTIME_CHART_RESIZE );
	        	if ( bIsFullWindow ) {
	        		popupHeight = cfg.css.height;
	        		$element.css({
	        			"height": cfg.css.height + "px",
	        			"bottom": "0px"
	        		});
	        		$elAgentChartListWrapper.css("height", "150px");
	        	} else {
	        		popupHeight = $window.innerHeight - cfg.css.navbarHeight;
	        		$element.css({
	        			"height": popupHeight + "px",
	        			"bottom": "0px"
	        		});
	        		$elAgentChartListWrapper.css("height", (popupHeight - cfg.css.titleHeight) + "px");
	        	}
	        	bIsFullWindow = !bIsFullWindow;
	        };
	        $scope.closePopup = function() {
	        	stopReceive();
	        	stopChart();
				$elWarningMessage.hide();
				$elTitle.html( currentApplicationName = "" );
				$elSumChartCount.html("0");
	        };
	        $($window).on("resize", function() {
	        	adjustWidth();
	        });
	    }
	]);
})(jQuery);