(function () {
	
	var ceclient = new CEClient();
	var username, password;
	
	$(document).ready(function () {
		
		ceclient.init(true, true);
        $('#container').html('<div id="form_login">'+
		'<input id="username" class="loginFields" placeholder="username"   type="text"  class="inline">'+
		'<input id="password" class="loginFields" placeholder="password"  type="password"   class="inline">'+
		'<input id="submit" type="button"  class="inline" value="Login" ></div>');
		$('#container').on( 'click', '#submit', function () {execLogin($('#username').val(), $('#password').val());});
		$('.loginFields').keypress(function (e) {
			if (e.which==13){
				execLogin($('#username').val(), $('#password').val());
			}
		});
		
		
		 var execLogin = function (username, password) {

			ceclient.login(username, password,
				function (res) {

					if(res==true){
						$('#form_login').slideUp('slow', function(){
						$('#container').html(
							'<div id="form_graph" style="display: inline">'+
							'<input id="responseId" placeholder="response ID" type="text"  class="inline"  value="3658">'+
							'<input id="checkHappy" type="checkbox"  class="inline, metricCheck"  value="3" checked="checked"> Happy'+
							'<input id="checkSurprise" type="checkbox"  class="inline, metricCheck"  value="4" checked="checked"> Surprise'+
							'<input id="checkAngry" type="checkbox"  class="inline, metricCheck"  value="5" checked="checked"> Angry'+
							'<input id="checkDisgust" type="checkbox"  class="inline, metricCheck"  value="6" checked="checked"> Disgust'+
							'<input id="checkFear" type="checkbox"  class="inline, metricCheck"  value="7" checked="checked"> Fear'+
							'<input id="checkSadness" type="checkbox"  class="inline, metricCheck"  value="8" checked="checked"> Sadness'+
							'<input id="checkPositiveMood" type="checkbox"  class="inline, metricCheck"  value="9" checked="checked"> Positive mood'+
							'<input id="checkNegativeMood" type="checkbox"  class="inline, metricCheck"  value="10" checked="checked"> Negative mood'+
							'<input id="checkEngagement" type="checkbox"  class="inline, metricCheck"  value="11" checked="checked"> Engagement '+
							'<input id="submitRequestId" type="button"  class="inline"  value="Send Request" >'+
							'<div id="graph"></div></div>');
							$('#responseId').keypress(function (e) {
								if (e.which==13){
									$('#submitRequestId').click();
								}
							})

						$('#form_graph').slideDown('slow');
						});
						$('#container').on( 'click', '#submitRequestId', function () {
							//plot the graph
							ceclient.readTimeseries($('#responseId').val(),[1,3,4,5,6,7,8],drawGraph,true);
						});
						$('#container').on( 'click', '#submitLogout', function () {
							execLogout();
						})

					}
					else{
						alert('Login fail');
					}

			});
				
		}
		
		var execLogout = function (res) {
            ceclient.logout(function (){location.reload(true);});
        };

		var drawGraph = function (apiData) {
			$('#form_graph').slideUp('slow');
			var metricIds = $('input:checkbox:checked.metricCheck').map(function () {
				return this.value;
			}).get();
			showGraph(apiData,"line",metricIds,"graph");
			$('#form_graph').slideDown('slow');
			window.addEventListener('resize', function () {
				d3.select("#graph").html("");
				console.log(parseInt(d3.select("#graph").style("width").substring(0,d3.select("#graph").style("width").length-2)));
			    showGraph(apiData,"line",metricIds,"graph");
		//		console.log(parseInt(d3.select("#graph").style("width").substring(0,d3.select("#graph").style("width").length-2)));
			});
		};
		
});
})();