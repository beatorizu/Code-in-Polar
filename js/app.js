angular.module('happyWorkspace', [
  'happyWorkspace.controllers',
  'happyWorkspace.services',
  'highcharts-ng',
  'ngRoute'
  ]);
 
angular.module('happyWorkspace.controllers',[]);
angular.module('happyWorkspace.services',[]);

angular.module('happyWorkspace.services')
	.service('env', function() {
		var constants = {ngrok: "https://32f20e4e.ngrok.io"}

		return {
			getConstants: function(){
				return constants;
			}
		}
	})