'use strict';

angular
  .module('happyWorkspace.controllers')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope','$rootScope','$location','$timeout','$window','$http','env'];

function DashboardCtrl($scope,$rootScope,$location,$timeout,$window,$http,env){

  /**-------------------------------
         View Model Definition
  ---------------------------------**/

  var vm = this;

  vm.chartExercicioConfig = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Aceitação de Pausa para Exercício ao Longo do Expediente'
    },
    xAxis: {
      categories: [],
      labels: {
          format: '{value} h'
      }
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
      headerFormat: '<b>{point.x} h</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
          stacking: 'normal',
          dataLabels: {
              enabled: true,
              color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
          },
          colors: ["#1a9100", "#e80000"]
      },
      series: {
        dataLabels: {
          enabled: true,
          formatter: function() {
          	return this.y>0?this.y:null;
          }
        }
    	}
    },
    series: []        
	};

	vm.chartProblemasConfig = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Eficiencia em Solução de Problemas'
    },
    xAxis: {
      categories: [],
      labels: {
          format: '{value}'
      }
    },
    yAxis: {
      min: 0,
      title: {
          text: 'Solução'
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
      },
      series: {
        dataLabels: {
          enabled: true,
          formatter: function() {
          	return this.y>0?this.y:null;
          }
        }
    	}
    },
    series: []        
	};

	function getExercicios() {
		vm.categoriesExercicios = [];
		vm.seriesExercicios = [];

		$http({
		  method: 'GET',
		  url: env.getConstants().ngrok + '/exercicios'
		}).then(function successCallback(response) {
		  vm.rawDataExercicios = response.data;
		  getCategoriesExercicios();
		  getSeriesExercicios();
	  }, function errorCallback(response) {

	  });
	}

	function getCategoriesExercicios() {
		var tempSeriesSim = []
		var tempSeriesNao = []
		angular.forEach(vm.rawDataExercicios, function(exercicio){
			var temp = new Date(exercicio.datetime);
			if (vm.categoriesExercicios.indexOf((temp.getHours()+4)) < 0){
				vm.categoriesExercicios.push((temp.getHours()+4));
				tempSeriesSim.push(0);
				tempSeriesNao.push(0);
			}
		});
		vm.categoriesExercicios.sort(function(a, b){return a-b});
		vm.chartExercicioConfig.xAxis.categories = vm.categoriesExercicios;
		vm.seriesExercicios.push({name: "Sim", color: "#1a9100", data: tempSeriesSim});
		vm.seriesExercicios.push({name: "Não", color: "#e80000", data: tempSeriesNao});
	}

	function getSeriesExercicios() {
		angular.forEach(vm.rawDataExercicios, function(exercicio){
			var temp = new Date(exercicio.datetime);
			var value = temp.getHours()+4;
			if (exercicio.exercicios) {
				vm.seriesExercicios[0].data[vm.categoriesExercicios.indexOf(value)] = vm.seriesExercicios[0].data[vm.categoriesExercicios.indexOf(value)]+1;
			} else {
				vm.seriesExercicios[1].data[vm.categoriesExercicios.indexOf(value)] = vm.seriesExercicios[1].data[vm.categoriesExercicios.indexOf(value)]+1;
			}			
		});
		vm.chartExercicioConfig.series = vm.seriesExercicios;
	}

	function getProblemas() {
		vm.categoriesProblemas = [];
		vm.seriesProblemas = [];

		$http({
		  method: 'GET',
		  url: env.getConstants().ngrok + '/problemas'
		}).then(function successCallback(response) {
		  vm.rawDataProblemas = response.data;
		  getCategoriesProblemas();
		  getSeriesProblemas();
	  }, function errorCallback(response) {

	  });
	}

	function getCategoriesProblemas() {
		var tempSeriesSim = []
		var tempSeriesNao = []
		angular.forEach(vm.rawDataProblemas, function(problema){
			var temp = problema.tipo;
			if (vm.categoriesProblemas.indexOf(temp) < 0){
				vm.categoriesProblemas.push(temp);
				tempSeriesSim.push(0);
				tempSeriesNao.push(0);
			}
		});
		//vm.categoriesProblemas.sort(function(a, b){return a-b});
		vm.chartProblemasConfig.xAxis.categories = vm.categoriesProblemas;
		vm.seriesProblemas.push({name: "Solucionado", color: "#1a9100", data: tempSeriesSim});
		vm.seriesProblemas.push({name: "Não Solucionado", color: "#e80000", data: tempSeriesNao});
	}

	function getSeriesProblemas() {
		angular.forEach(vm.rawDataProblemas, function(problema){
			var value = problema.tipo;
			if (problema.solucao) {
				vm.seriesProblemas[0].data[vm.categoriesProblemas.indexOf(value)] = vm.seriesProblemas[0].data[vm.categoriesProblemas.indexOf(value)]+1;
			} else {
				vm.seriesProblemas[1].data[vm.categoriesProblemas.indexOf(value)] = vm.seriesProblemas[1].data[vm.categoriesProblemas.indexOf(value)]+1;
			}			
		});
		vm.chartProblemasConfig.series = vm.seriesProblemas;
	}

	getProblemas();
	getExercicios();
}