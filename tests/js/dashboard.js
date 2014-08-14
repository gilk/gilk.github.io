(function () {

    var ceclient = new CEClient();
    var username, password;
    var statusReader;
    var responseId;
    var video;
    var oneSecIndex = [];
    var timeSeriesData;
    var videoInfo;
    var graphType = "gk-test"; //hc OR dt OR dimple

    function ce_log(val){
        if(console.log){
            console.log(val);
        }
        $('#log .content').prepend("<br/>"+ val);
    }

    function writeInfo(val,  clear, type){
        (!type)? type = 'info':'';
        (!clear)? clear = false: clear = true;
        if(clear) $('#info').html('');
        $('#info').append(val+'<br/>');
        $('#info').removeClass();
        $('#info').addClass(type);
    }

    function loading(clear){
        ce_log('load' + clear);
        (!clear)? clear = false : '';
        (clear==false)? $('#load').html('load...') : $('#load').html('');
    }

    $(document).ready(function () {

        ce_log('Insert login');

        ceclient.init(true, true);
        $('#container').html('<div id="form_login">'+
            '<input id="username" placeholder="username"   type="text"  class="inline" >'+
            '<input id="password" placeholder="password"  type="text"   class="inline" >'+
            '<input id="submit" type="button"  class="inline" value="Login" ></div>');
        $('#container').on( 'click', '#submit', function () {
            loading();
            execLogin($('#username').val(), $('#password').val());
        })

        var execLogin = function (username, password) {
            loading(true);
            ce_log('creds inserted '+username+' *******');
            ceclient.login(username, password,
                function (res) {

                    ce_log('login results');
                    ce_log(res);
                    loading(true);
                    if(res==true){
                        $('#form_login').slideUp('slow', function(){
                            $('#container').html(
								'<div id="form_graph" style="display: none">'+
                                '<input id="responseId" placeholder="response ID" type="text"  class="inline"  value="3658">'+
                                '<input id="submitRequestId" type="button"  class="inline"  value="Send Request" >'+
                                '<div id="graph"></div></div>');
                            $('#container').append('<div id="legend"></div><div id="graph"></div>');
                            $('#container').append('<div id="infoVideo"></div>');
                            $('#container').append('<input id="stopCheckData" type="button" value="Stop check video status">');
                            $('#container').append('<div id="info"></div>');
                            $('#container').append('<div id="logout"><input id="submitLogout" type="button" value="Logout"></div>');

                            $('#form_graph').slideDown('slow');
                        });
                        $('#container').on( 'click', '#submitRequestId', function () {
                            loading();
                            clearInterval(statusReader);
                            writeInfo('', true);
                            //$('#graph').slideUp('slow').html('').slideDown('slow');
                            execReadFacevideoStatus($('#responseId').val());
                        })
                        $('#container').on( 'click', '#submitLogout', function () {
                            execLogout();
                        })
                        $('#container').on( 'click', '#stopCheckData', function () {
                            clearInterval(statusReader);
                            $('#stopCheckData').hide();
                        })
                    }else{
                        alert('Login fail');
                    }

                });
        }

        //READ METRICS
        var execReadFacevideoStatus = function (respId) {
            statusReader = setInterval(
                function () {
                    ce_log('READ FACEVIDEO STATUS');
                    responseId = respId;
                    ceclient.readFacevideoInfo(respId, execReadMetrics);
                }, 7000
            )

        };

        var publishInfo =  function (info){
            $('#infoVideo').show();
            $('#infoVideo').html('');
            $('#infoVideo').html(
                'fileName: "'+info.fileName+'" <br>' +
                'id: "'+info.id+'" <br>' +
                'lengthS: "'+info.lengthS+'" <br>' +
                'numFrames: "'+info.numFrames+'" <br>' +
                'responseId: "'+info.responseId+'" <br>'
            );
        }

        var execReadMetrics = function (resp) {
            var status = resp.status;
            videoInfo = resp;
            loading(true);
            publishInfo(resp);
            writeInfo('Video Status processing: ', false);
            if (status == 2) {
                clearInterval(statusReader);
                $('#stopCheckData').hide();
                writeInfo('Processing complete', false);
                ceclient.readFacevideoInfo(responseId, execRTS());
            } else if (status == 1) {
                writeInfo('Processing started', false,  'alert');
                $('#stopCheckData').show();
            }
            else if (status == 0) {
                writeInfo('Not Started', false, 'alert');
                $('#stopCheckData').show();
            }
            else if (status == -1) {
                writeInfo('Processing Error -  stop', false, 'error');
                $('#stopCheckData').show();
                clearInterval(statusReader);
            } else {
                writeInfo('Error -  video not exist or user not authorized', false, 'error');
                $('#stopCheckData').show();
                clearInterval(statusReader);
            }

        };

        //READ TIME SERIES
        var execRTS = function (videoInfo) {

            clearInterval(statusReader);
            video = videoInfo;
            ce_log('READ TIME SERIES');
            writeInfo('Download timeseries data', false)
            loading();
            ceclient.readTimeseries(responseId, [1, 3, 4, 5, 6, 7, 8], execGraph, false);
        };

        var execGraph = function(dataApi){
            loading(true);
			ce_log("READ THIS MUTHA")
            ce_log(dataApi);
			var engagement = [];
			for( var i = 0; i < dataApi[0].data.length; i++){
				if(dataApi[1].data[i]==null){
					engagement.push(null);
				}
				else {engagement.push(
					(dataApi[1].data[i]+dataApi[2].data[i]+dataApi[3].data[i]+dataApi[4].data[i]+dataApi[5].data[i]+dataApi[6].data[i])/6.0);
				}
			}
            timeSeriesData = [{"name":dataApi[0].metricName,"data":dataApi[0].data},
								{"name":dataApi[1].metricName,"data":dataApi[1].data},
								{"name":dataApi[2].metricName,"data":dataApi[2].data},
								{"name":dataApi[3].metricName,"data":dataApi[3].data},
								{"name":dataApi[4].metricName,"data":dataApi[4].data},
								{"name":dataApi[5].metricName,"data":dataApi[5].data},
								{"name":dataApi[6].metricName,"data":dataApi[6].data},
								{"name":"Engagement","data":engagement}];
								
            if(graphType=='hc'){
                dataTStoGraphHC(timeSeriesData)
            }else if(graphType=='dt' || graphType=='dimple' || graphType=='gk-test'){
                dataTStoGraphDT(timeSeriesData, graphType);
            }


        }

        //LOGOUT
        var execLogout = function (res) {
            clearInterval(statusReader);
            ce_log('LOGOUT');
            ceclient.logout(function (){location.reload(true);});
        };

        var execStopLoadingData = function(){
            clearInterval(statusReader);
        }

        var dataTStoGraphHC = function(data){

            // Extract from timeserie number 1 (time) the index of data correspondents to 1 seconds
            var sec_milest = 0;
            oneSecIndex = [];
            $(data[0]).each(function($k ,$v){
                // every second
                $v = parseInt($v);
                var step = 100;
                if($v % step == 0 || (parseInt(($v/step)) != sec_milest)) {
                    sec_milest = parseInt(($v / step));
                    oneSecIndex.push($k);
                }
            });

            ce_log('oneSecIndex Array index')
            console.log(oneSecIndex.length);
            // Extract from timeseries 2-7 the data according to 1sec index
            var dataGraph = [];
            dataGraph.push(data[0]);
            for(var i = 1; i < data.length; i++){
                var tm = data[i];
                var mi = i+1; //metricId

                var tosave = [];
                for(var tmi = 0; tmi < oneSecIndex.length; tmi++){
                    tosave.push( tm[ oneSecIndex[tmi] ]);
                }
                dataGraph.push(tosave);
            }
            showGraphHC(dataGraph);

        }

        var dataTStoGraphDT = function(data, graphType){

            showGraphDT(data, graphType);

        }



        $('#log legend').click(function(){
            $('#log .content').slideDown('slow');
            $('#log legend').html('Logs');
        })

    });
})();