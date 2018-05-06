'use strict';

angular
  .module('happyWorkspace.controllers')
  .controller('RHCtrl', RHCtrl);

RHCtrl.$inject = ['$scope','$rootScope','$location','$timeout','$window','$http','env','$routeParams'];

function RHCtrl($scope,$rootScope,$location,$timeout,$window,$http,env,$routeParams){

  /**-------------------------------
         View Model Definition
  ---------------------------------**/

  var vm = this;
  vm.action = $location.search();

  vm.icons = [];

  vm.icons['TI'] = "system-task";
  vm.icons['Psicologa'] = "psychology";
  vm.icons['Médica'] = "medical-doctor";
  vm.icons['RH'] = "collaboration";

  function getPessoas() {
    $http({
      method: 'GET',
      url: env.getConstants().ngrok + '/pessoas'
    }).then(function successCallback(response) {
      vm.rawDataPessoas = response.data;
      mountListaPessoas();
    }, function errorCallback(response) {

    });
  }

  vm.pessoas = [];

  function mountListaPessoas() {
    angular.forEach(vm.rawDataPessoas, function(pessoa){
      if (vm.action.tipo) {
        if (pessoa.skill == vm.action.tipo)
          vm.pessoas.push(pessoa);
      } else {
        vm.pessoas.push(pessoa);
      }
    });
    console.log(vm.pessoas);
  }

  getPessoas();
}