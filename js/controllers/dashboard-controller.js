'use strict';

angular
  .module('happyWorkspace.controllers')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope','$rootScope','$location','$timeout','$window','$http'];

function DashboardCtrl($scope,$rootScope,$location,$timeout,$window,$http){

  /**-------------------------------
         View Model Definition
  ---------------------------------**/

  var vm = this;

  vm.getExercicios = getExercicios;

  vm.teste = "Hello";

  //Highcharts.chart('containerHC', {
  	vm.chartConfig = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Aceitação de pausa para exercício'
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Aceitação'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        }
    },
    legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            }
        }
    },
    series: []        
	};

	vm.seriesTest = [{
        name: 'Sim',
        data: [5, 3, 4, 7, 2]
    }, {
        name: 'Não',
        data: [2, 2, 3, 2, 1]
    }];

	function getSeries() {
		angular.forEach(vm.rawData, function(exercicio){
			var temp = new Date(exercicio.datetime);
			var value = temp.getHours()+4;
			if (exercicio.exercicios) {
				vm.series[0].data[vm.categories.indexOf(value)] = vm.series[0].data[vm.categories.indexOf(value)]+1;
			} else {
				vm.series[1].data[vm.categories.indexOf(value)] = vm.series[1].data[vm.categories.indexOf(value)]+1;
			}
			
		})
		console.log(vm.series);
		vm.chartConfig.series = vm.series;
	}

	vm.categories = [];
	vm.series = [];

	function getCategories() {
		var tempSeriesSim = []
		var tempSeriesNao = []
		angular.forEach(vm.rawData, function(exercicio){
			var temp = new Date(exercicio.datetime);
			if (vm.categories.indexOf((temp.getHours()+4)) < 0){
				vm.categories.push((temp.getHours()+4));
				tempSeriesSim.push(0);
				tempSeriesNao.push(0);
			}
		});
		vm.categories.sort(function(a, b){return a-b});
		vm.series.push({name: "Sim", data: tempSeriesSim});
		vm.series.push({name: "Não", data: tempSeriesNao});
		console.log(vm.categories);
		vm.chartConfig.xAxis.categories = vm.categories;
	}

	function getExercicios() {
		$http({
		  method: 'GET',
		  url: 'https://83d98bf9.ngrok.io/exercicios'
		}).then(function successCallback(response) {
		  vm.rawData = response.data;
		  getCategories();
		  getSeries();
			//vm.chartConfig.series = getSeries();
	  }, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });

	}

	getExercicios();
}