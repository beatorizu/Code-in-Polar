angular.module('happyWorkspace', [
  'happyWorkspace.controllers',
  'happyWorkspace.services',
  'highcharts-ng'
  ]);
 
angular.module('happyWorkspace.controllers',[]);
angular.module('happyWorkspace.services',[]);

angular.module('happyWorkspace.services')
	.service('env', function() {
		var constants = {ngrok: "https://83d98bf9.ngrok.io"}

		return {
			getConstants: function(){
				return constants;
			}
		}
	})